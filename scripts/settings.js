const moduleName = 'smooth-combat';

class Settings {
  init() {
    this.registerSetting('applyDamage', { name: 'Apply damage automatically' });
    this.registerSetting('removeTargetsPre', { name: 'Remove targets before an attack' });
    this.registerSetting('removeRargetsPost', { name: 'Remove targets after an attack' });
  }

  registerSetting(internalName, options = {}) {
    if (options.name === undefined) options.name = internalName;
    const defaultValue = options.default === undefined ? true : options.default;
    game.settings.register(moduleName, internalName, {
      name: 'Unnamed setting, contact danielrab on discord or GitHub',
      scope: 'world',
      config: true,
      type: defaultValue.constructor,
      default: true, // The default value for the setting
      ...options,
    });
    Object.defineProperty(this, internalName, {
      get() {
        return game.settings.get(moduleName, internalName);
      },
      set(value) {
        game.settings.set(moduleName, internalName, value);
      },
    });
  }
}

export default new Settings();
