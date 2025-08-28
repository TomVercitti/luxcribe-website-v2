/**
 * Feature Flags for Luxcribe.
 * This allows for conditional toggling of new features in development and production.
 */
export const featureFlags = {
  /**
   * Enables the new dynamic pricing engine for engraving services.
   * When false, the application uses the original pricing logic.
   * When true, new UI and logic will be activated in the editor.
   */
  LUXCRIBE_PRICING_ENGINE: true,
};