import { HandleTypeDefinition, HandleRegistry } from "~/types/handle";
import { HandleType } from "~/enums/handle-type.enum";

class HandleTypeRegistry implements HandleRegistry {
  private handleTypes: Map<HandleType, HandleTypeDefinition> = new Map();

  register(definition: HandleTypeDefinition): void {
    this.handleTypes.set(definition.type, definition);
  }

  unregister(handleTypeId: HandleType) {
    this.handleTypes.delete(handleTypeId);
  }

  get(type: HandleType): HandleTypeDefinition | undefined {
    return this.handleTypes.get(type);
  }

  getAll(): HandleTypeDefinition[] {
    return Array.from(this.handleTypes.values());
  }

  isCompatible(sourceType: HandleType, targetType: HandleType): boolean {
    const sourceDefinition = this.get(sourceType);
    const targetDefinition = this.get(targetType);

    if (!sourceDefinition || !targetDefinition) {
      return false;
    }

    // Check if source has custom compatibility check
    if (sourceDefinition.customCompatibilityCheck) {
      return sourceDefinition.customCompatibilityCheck(sourceType, targetType);
    }

    // Check if target has custom compatibility check
    if (targetDefinition.customCompatibilityCheck) {
      return targetDefinition.customCompatibilityCheck(sourceType, targetType);
    }

    // Default compatibility check
    return sourceDefinition.compatibleWith.includes(targetType);
  }

  transform(data: any, sourceType: HandleType, targetType: HandleType): any {
    const sourceDefinition = this.get(sourceType);

    if (!sourceDefinition?.transformer) {
      return data; // No transformation needed
    }

    return sourceDefinition.transformer(data, targetType);
  }
}

// Create global registry instance
export const handleRegistry = new HandleTypeRegistry();

export function addHandleType(definition: HandleTypeDefinition): void {
  handleRegistry.register(definition);
}

export function removeHandleType(handleTypeId: HandleType): void {
  handleRegistry.unregister(handleTypeId);
}

export function hasHandleType(handleTypeId: HandleType): boolean {
  return handleRegistry.get(handleTypeId) !== undefined;
}

export function getAllHandleTypes(): HandleTypeDefinition[] {
  return handleRegistry.getAll();
}

export const isHandleCompatible = (sourceType: HandleType, targetType: HandleType): boolean => {
  return handleRegistry.isCompatible(sourceType, targetType);
};

export const transformHandleData = (
  data: any,
  sourceType: HandleType,
  targetType: HandleType
): any => {
  return handleRegistry.transform(data, sourceType, targetType);
};

export const getHandleTypeDefinition = (type: HandleType): HandleTypeDefinition | undefined => {
  return handleRegistry.get(type);
};
