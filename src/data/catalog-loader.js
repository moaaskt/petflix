/**
 * Catalog Loader - Carrega dados do catálogo
 */
class CatalogLoader {
  constructor() {
    this.cache = {};
  }

  /**
   * Carrega dados de um arquivo JSON
   * @param {string} file - Nome do arquivo (movies, series, documentaries)
   * @returns {Promise<Object>} Dados do catálogo
   */
  async load(file) {
    if (this.cache[file]) {
      return this.cache[file];
    }

    try {
      const response = await fetch(`src/data/catalog/${file}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${file}.json`);
      }
      const data = await response.json();
      this.cache[file] = data;
      return data;
    } catch (error) {
      console.error(`Error loading catalog ${file}:`, error);
      return {};
    }
  }

  /**
   * Carrega dados de filmes
   * @param {string} petType - Tipo de pet ('dog' ou 'cat')
   * @returns {Promise<Object>} Dados de filmes
   */
  async loadMovies(petType = 'dog') {
    const data = await this.load('movies');
    return data[petType] || data.dogs || {};
  }

  /**
   * Carrega dados de séries
   * @param {string} petType - Tipo de pet ('dog' ou 'cat')
   * @returns {Promise<Object>} Dados de séries
   */
  async loadSeries(petType = 'dog') {
    const data = await this.load('series');
    return data[petType] || data.dogs || {};
  }

  /**
   * Carrega dados de documentários
   * @param {string} petType - Tipo de pet ('dog' ou 'cat')
   * @returns {Promise<Object>} Dados de documentários
   */
  async loadDocumentaries(petType = 'dog') {
    const data = await this.load('documentaries');
    return data[petType] || data.dogs || {};
  }
}

export const catalogLoader = new CatalogLoader();









