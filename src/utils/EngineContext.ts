import type semver from 'semver';

export class EngineContext {
  readonly engines: ReadonlySet<string>;

  readonly #invalidEngines = new Map<string, Map<string, semver.Range>>();
  get invalidEngines(): ReadonlyMap<string, ReadonlyMap<string, semver.Range>> {
    return this.#invalidEngines;
  }
  get isValid(): boolean {
    return this.#invalidEngines.size === 0;
  }

  readonly #uncheckedEngines: Set<string>;
  get areAllChecked(): boolean {
    return this.#uncheckedEngines.size === 0;
  }

  constructor(engineNames: Iterable<string>) {
    this.engines = new Set(engineNames);
    this.#uncheckedEngines = new Set(this.engines);
  }

  public markAsChecked(module: string): void {
    this.#uncheckedEngines.delete(module);
  }

  public markAsInvalid(module: string, allowedVersion: semver.Range): void {
    const existingVersion = this.#invalidEngines.get(module);
    if (existingVersion) {
      existingVersion.set(allowedVersion.raw, allowedVersion);
    } else {
      this.#invalidEngines.set(
        module,
        new Map([[allowedVersion.raw, allowedVersion]]),
      );
    }
  }
}
