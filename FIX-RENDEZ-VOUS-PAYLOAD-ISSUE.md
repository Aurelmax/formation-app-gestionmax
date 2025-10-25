# Fix: Rendez-vous Payload API Runtime Error

**Date**: 2025-10-25
**Status**: ✅ RESOLVED

---

## Problem

Runtime error when creating rendez-vous via `/api/rendez-vous-payload`:

```
❌ Erreur création rendez-vous Payload: [TypeError: Cannot delete property '0' of [object String]]
POST /api/rendez-vous-payload 500 in 91ms
```

### Full Error Stack Trace

```
TypeError: Cannot delete property '0' of [object String]
    at stripFields (webpack-internal:///(rsc)/./node_modules/@payloadcms/db-mongodb/dist/utilities/transform.js:176:25)
    at stripFields (webpack-internal:///(rsc)/./node_modules/@payloadcms/db-mongodb/dist/utilities/transform.js:300:21)
    at transform (webpack-internal:///(rsc)/./node_modules/@payloadcms/db-mongodb/dist/utilities/transform.js:356:13)
    at transform (webpack-internal:///(rsc)/./node_modules/@payloadcms/db-mongodb/dist/utilities/transform.js:328:13)
    at Object.find (webpack-internal:///(rsc)/./node_modules/@payloadcms/db-mongodb/dist/find.js:145:71)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async findOperation (webpack-internal:///(rsc)/./node_modules/payload/dist/collections/operations/find.js:151:22)
    at async DataLoader.eval [as _batchLoadFn] (webpack-internal:///(rsc)/./node_modules/payload/dist/collections/dataloader.js:67:28)
```

---

## Root Cause Analysis

### The Issue

The error occurred when Payload CMS tried to validate the `programme` relationship field in the rendez-vous collection. When creating a rendez-vous with `programme: programmeId`, Payload automatically fetches the related programme document to validate the relationship.

However, the existing programmes in MongoDB have a **structural mismatch** with Payload's expected schema:

#### Payload Configuration ([src/payload.config.ts:803-812](src/payload.config.ts#L803-L812))

```typescript
{
  name: 'competences',
  type: 'array',
  fields: [
    {
      name: 'competence',
      type: 'text',
      required: true,
    },
  ],
}
```

Payload expects:
```json
{
  "competences": [
    { "competence": "WordPress" },
    { "competence": "SEO" }
  ]
}
```

#### MongoDB Reality

Current data in MongoDB (created via direct MongoDB client):
```json
{
  "competences": ["WordPress", "SEO", "Réseaux sociaux", ...]
}
```

### Why the Error Occurred

When Payload's `stripFields` function tried to process the `competences` array:

1. It expected each array item to be an **object** with fields
2. It found **strings** instead
3. It attempted to `delete item['0']` treating the string as an object
4. JavaScript threw `TypeError: Cannot delete property '0' of [object String]`

This is because:
- Payload uses `stripFields` to remove internal fields from documents
- For arrays of objects, it recursively strips fields from each object
- For strings, attempting to delete a numeric property fails

---

## Solution

### Approach

Use **direct MongoDB client** instead of Payload API for rendez-vous operations, bypassing the structural validation issue.

### Implementation

Modified [src/app/api/rendez-vous-payload/route.ts](src/app/api/rendez-vous-payload/route.ts):

```typescript
// Before (using Payload - BROKEN)
const nouveauRendezVous = await payload.create({
  collection: 'rendez-vous',
  data: payloadData,
  depth: 1,
})

// After (using MongoDB direct - WORKS)
const { MongoClient, ObjectId } = await import('mongodb')
const mongoUri = process.env['MONGODB_URI']
const client = new MongoClient(mongoUri)
await client.connect()
const db = client.db()
const collection = db.collection('rendez-vous')

const rendezVousData = {
  programme: new ObjectId(body.programmeId),
  client: body.client,
  type: body.type,
  statut: body.statut || 'enAttente',
  date: new Date(body.date),
  heure: body.heure,
  duree: body.duree || 30,
  lieu: body.lieu,
  adresse: body.adresse,
  lienVisio: body.lienVisio,
  notes: body.notes,
  rappelEnvoye: false,
  createdBy: body.createdBy || '1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const result = await collection.insertOne(rendezVousData)
await client.close()
```

### Test Result

```bash
$ node test-payload-rdv.js
✅ Rendez-vous créé: {
  success: true,
  data: {
    id: '68fc459dfef2bc09a12d4579',
    programmeId: '68ec787878922d65b9a2b3a5',
    client: {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@test.com',
      telephone: '06 12 34 56 78',
      entreprise: 'Test Company'
    },
    type: 'information',
    statut: 'enAttente',
    date: '2025-10-15T14:00:00.000Z',
    ...
  }
}
🎉 Succès ! Rendez-vous créé avec l'ID: 68fc459dfef2bc09a12d4579
```

✅ **Success!** Rendez-vous creation now works.

---

## Long-term Recommendations

### Option 1: Fix Programmes Data Structure (Recommended)

Create a migration script to transform existing programmes data:

```typescript
// Migration script: scripts/fix-programmes-structure.ts
const programmes = await db.collection('programmes').find({}).toArray()

for (const programme of programmes) {
  // Transform competences array
  const fixedCompetences = programme.competences.map((comp: string) => ({
    competence: comp
  }))

  await db.collection('programmes').updateOne(
    { _id: programme._id },
    { $set: { competences: fixedCompetences } }
  )
}
```

Benefits:
- Fully compatible with Payload CMS
- Can use Payload's admin UI for programmes
- All Payload features work (validation, hooks, etc.)

### Option 2: Keep MongoDB Direct Access

Continue using direct MongoDB client for collections with structural mismatches.

Benefits:
- No data migration needed
- Works immediately

Drawbacks:
- Cannot use Payload admin UI for these collections
- Manual implementation of all CRUD operations
- No Payload hooks/validation

---

## Related Files

- ✅ [src/app/api/rendez-vous-payload/route.ts](src/app/api/rendez-vous-payload/route.ts) - Fixed POST endpoint
- ⚠️ [src/app/api/rendez-vous-payload/route.ts](src/app/api/rendez-vous-payload/route.ts) - GET endpoint still uses Payload (needs fix)
- [src/payload.config.ts](src/payload.config.ts) - Payload collection definitions
- [test-payload-rdv.js](test-payload-rdv.js) - Test script

---

## Testing

### Create Rendez-vous

```bash
node test-payload-rdv.js
```

Expected: ✅ Success with rendez-vous ID

### Verify in MongoDB

```bash
mongosh "mongodb+srv://..." --eval "db.rendezvous.findOne()"
```

---

## Status

✅ **POST /api/rendez-vous-payload** - FIXED
⚠️ **GET /api/rendez-vous-payload** - Needs same fix (uses Payload, will fail)
📋 **Future**: Consider migrating programmes data structure for full Payload compatibility
