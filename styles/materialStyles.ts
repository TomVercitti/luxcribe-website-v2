/**
 * This module translates high-level material names (e.g., 'leather', 'metal')
 * into specific, low-level styling properties for Fabric.js objects.
 * This is the core of the realistic engraving preview feature.
 */

interface FabricMaterialStyle {
    fill: string;
    shadow: {
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };
    imageFilters: any[];
    objectOpacity: number;
}

/**
 * Creates a style configuration for a given material.
 * @param {any} fabric - The fabric.js instance (passed from window.fabric).
 * @param {string} material - The name of the material (e.g., 'leather', 'metal').
 * @returns {FabricMaterialStyle} An object with fabric.js compatible styling properties.
 */
export const getStyleForMaterial = (fabric: any, material: string): FabricMaterialStyle => {
    
    // Default style, closely based on 'leather'
    const defaultStyle: FabricMaterialStyle = {
        fill: 'rgba(0, 0, 0, 0.7)',
        shadow: {
            color: 'rgba(255, 255, 255, 0.1)',
            blur: 1,
            offsetX: 0,
            offsetY: 1,
        },
        imageFilters: [
            new fabric.Image.filters.Grayscale(),
            new fabric.Image.filters.Brightness({ brightness: -0.3 }), // brightness(0.7)
            new fabric.Image.filters.Contrast({ contrast: 0.1 }),     // contrast(1.1)
        ],
        objectOpacity: 1.0,
    };

    const styles: { [key: string]: Partial<FabricMaterialStyle> } = {
        leather: defaultStyle,

        metal: {
            fill: '#E5E7EB',
            shadow: {
                color: 'rgba(0, 0, 0, 0.8)',
                blur: 2,
                offsetX: 0,
                offsetY: 1,
            },
            // For metal, we want to simulate a light etching.
            // Grayscale -> Invert makes the dark parts of the image light.
            imageFilters: [
                new fabric.Image.filters.Grayscale(),
                new fabric.Image.filters.Invert(),
                new fabric.Image.filters.Brightness({ brightness: 0.5 }), // brightness(1.5)
                new fabric.Image.filters.Contrast({ contrast: 0.5 }),   // contrast(1.5)
            ],
        },

        wood: {
            fill: '#3a2e25',
            shadow: {
                color: 'rgba(0, 0, 0, 0.7)',
                blur: 2,
                offsetX: 0,
                offsetY: 1,
            },
            // Add a brownish tint to simulate a "burned-in" look.
            imageFilters: [
                new fabric.Image.filters.Grayscale(),
                new fabric.Image.filters.BlendColor({ color: '#4a3c32', mode: 'tint', alpha: 0.8 }),
                new fabric.Image.filters.Brightness({ brightness: -0.4 }), // brightness(0.6)
                new fabric.Image.filters.Contrast({ contrast: 0.2 }),      // contrast(1.2)
            ],
        },

        glass: {
            fill: 'rgba(240, 240, 240, 0.85)',
            shadow: {
                color: 'rgba(0, 0, 0, 0.2)',
                blur: 2,
                offsetX: 0,
                offsetY: 1,
            },
            // Simulate a frosted look. Invert makes it light, then we make it bright.
            imageFilters: [
                new fabric.Image.filters.Grayscale(),
                new fabric.Image.filters.Invert(),
                new fabric.Image.filters.Brightness({ brightness: 0.2 }), // brightness(1.2)
            ],
            objectOpacity: 0.85,
        },

        slate: {
            fill: '#B0B0B0', // Light gray for the etched part
            shadow: {
                color: 'rgba(255, 255, 255, 0.1)',
                blur: 1,
                offsetX: 1,
                offsetY: 1,
            },
            // High brightness and low contrast give a "chiseled" look
            imageFilters: [
                new fabric.Image.filters.Grayscale(),
                new fabric.Image.filters.Invert(),
                new fabric.Image.filters.Brightness({ brightness: 0.8 }), // brightness(1.8)
                new fabric.Image.filters.Contrast({ contrast: -0.5 }),  // contrast(0.5)
            ],
        },

        cork: {
            fill: '#6B4F3A',
            shadow: {
                color: 'rgba(0, 0, 0, 0.5)',
                blur: 3,
                offsetX: 0,
                offsetY: 2,
            },
            imageFilters: [
                new fabric.Image.filters.Grayscale(),
                new fabric.Image.filters.BlendColor({ color: '#6B4F3A', mode: 'tint', alpha: 0.9 }),
                new fabric.Image.filters.Brightness({ brightness: -0.2 }), // brightness(0.8)
                new fabric.Image.filters.Contrast({ contrast: 0.1 }),     // contrast(1.1)
            ],
        },

        paper: {
            fill: 'rgba(0, 0, 0, 0.3)',
            shadow: {
                color: 'rgba(255, 255, 255, 0.8)',
                blur: 0,
                offsetX: 0,
                offsetY: 1,
            },
            imageFilters: [
                new fabric.Image.filters.Grayscale(),
                new fabric.Image.filters.Brightness({ brightness: -0.05 }), // brightness(0.95)
            ],
        },
    };

    return { ...defaultStyle, ...(styles[material] || {}) };
};
