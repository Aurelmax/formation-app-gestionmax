import { FormationPersonnalisee } from '@/types/index';
import { validate, formationValidationRules } from '@/lib/validation&apos;;

/**
 * Logique métier pour les formations personnalisées
 * Sépare la logique métier de l&apos;interface utilisateur
 */
export class FormationBusinessLogic {
  /**
   * Valide une formation personnalisée
   */
  static validateFormation(formation: Partial<FormationPersonnalisee>): Record<string, string> {
    return validate(formation, formationValidationRules);
  }

  /**
   * Génère un code de formation unique
   */
  static generateFormationCode(clientName?: string): string {
    const timestamp = Date.now().toString().slice(-6);
    const clientPrefix = clientName ? clientName.toUpperCase().slice(0, 3) : 'A';
    return `${clientPrefix}${timestamp}-${clientName?.toUpperCase() || 'CLIENT'}`;
  }

  /**
   * Calcule la durée totale d&apos;une formation
   */
  static calculateTotalDuration(programmeDetail: FormationPersonnalisee['programme_detail&apos;]): string {
    if (!programmeDetail || programmeDetail.length === 0) {
      return '0h';
    }

    const totalHours = programmeDetail.reduce((total, jour) => {
      const duree = jour.duree;
      const hours = parseInt(duree.match(/\d+/)?.[0] || '0');
      return total + hours;
    }, 0);

    return `${totalHours}h`;
  }

  /**
   * Vérifie si une formation peut être finalisée
   */
  static canFinalizeFormation(formation: FormationPersonnalisee): { canFinalize: boolean; reasons: string[] } {
    const reasons: string[] = [];

    if (!formation.title?.trim()) {
      reasons.push('Le titre est requis&apos;);
    }

    if (!formation.code_formation?.trim()) {
      reasons.push('Le code formation est requis&apos;);
    }

    if (!formation.objectifs || Object.keys(formation.objectifs).length === 0) {
      reasons.push('Les objectifs sont requis&apos;);
    }

    if (!formation.programme_detail || formation.programme_detail.length === 0) {
      reasons.push('Le programme détaillé est requis&apos;);
    }

    if (!formation.contact_formateur?.nom?.trim()) {
      reasons.push('Les informations du formateur sont requises&apos;);
    }

    if (!formation.modalites_acces?.duree?.trim()) {
      reasons.push('La durée est requise');
    }

    if (!formation.modalites_acces?.tarif || formation.modalites_acces.tarif <= 0) {
      reasons.push('Le tarif doit être défini');
    }

    return {
      canFinalize: reasons.length === 0,
      reasons
    };
  }

  /**
   * Prépare les données pour l&apos;envoi
   */
  static prepareFormationForSubmission(formation: FormationPersonnalisee): FormationPersonnalisee {
    return {
      ...formation,
      // Nettoyer les données
      title: formation.title?.trim(),
      code_formation: formation.code_formation?.trim(),
      // S'assurer que les dates sont correctement formatées
      date_creation: formation.date_creation || new Date(),
      date_modification: new Date(),
      // Valider les données imbriquées
      contact_formateur: {
        nom: formation.contact_formateur?.nom?.trim() || '',
        email: formation.contact_formateur?.email?.trim() || '',
        telephone: formation.contact_formateur?.telephone?.trim() || '',
        role: formation.contact_formateur?.role?.trim() || '',
        biographie: formation.contact_formateur?.biographie?.trim() || ''
      }
    };
  }

  /**
   * Calcule les statistiques d&apos;une formation
   */
  static calculateFormationStats(formation: FormationPersonnalisee) {
    const programmeDetail = formation.programme_detail || [];
    const totalDays = programmeDetail.length;
    const totalModules = programmeDetail.reduce((total, jour) => total + jour.modules.length, 0);
    const totalDuration = this.calculateTotalDuration(programmeDetail);

    return {
      totalDays,
      totalModules,
      totalDuration,
      isComplete: this.canFinalizeFormation(formation).canFinalize
    };
  }

  /**
   * Génère un résumé de formation
   */
  static generateFormationSummary(formation: FormationPersonnalisee): string {
    const stats = this.calculateFormationStats(formation);
    const formateur = formation.contact_formateur?.nom || 'Non défini';
    const tarif = formation.modalites_acces?.tarif || 0;

    return `Formation "${formation.title}" - ${stats.totalDuration} sur ${stats.totalDays} jour(s) - ${stats.totalModules} modules - Formateur: ${formateur} - Tarif: ${tarif}€`;
  }

  /**
   * Vérifie les conflits de dates avec d&apos;autres formations
   */
  static checkDateConflicts(
    formation: FormationPersonnalisee,
    existingFormations: FormationPersonnalisee[]
  ): { hasConflict: boolean; conflictingFormations: FormationPersonnalisee[] } {
    // Logique de vérification des conflits de dates
    // À implémenter selon les besoins spécifiques
    return {
      hasConflict: false,
      conflictingFormations: []
    };
  }

  /**
   * Exporte une formation en format structuré
   */
  static exportFormation(formation: FormationPersonnalisee, format: 'json&apos; | 'pdf' | 'docx' = 'json&apos;) {
    const preparedFormation = this.prepareFormationForSubmission(formation);
    
    switch (format) {
      case 'json&apos;:
        return JSON.stringify(preparedFormation, null, 2);
      case 'pdf':
        // Logique d&apos;export PDF à implémenter
        throw new Error('Export PDF non implémenté&apos;);
      case 'docx':
        // Logique d&apos;export DOCX à implémenter
        throw new Error('Export DOCX non implémenté&apos;);
      default:
        throw new Error('Format d\'export non supporté&apos;);
    }
  }
}
