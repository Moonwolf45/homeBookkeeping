import axios from 'axios';
import { environment } from '@/environments/environment';
import { i18n } from '@/i18n/i18n';

class Category {
  constructor (user_id, title, color, id = null) {
    this.id = id !== null ? parseInt(id) : null;
    this.user_id = parseInt(user_id);
    this.title = title;
    this.color = color;
  }
}

export default {
  state: {
    category: null
  },
  mutations: {
    loadCategory (state, payload) {
      if (payload !== null) {
        state.category = payload
      } else {
        state.category = null
      }
    }
  },
  actions: {
    async getCategory ({ commit }, payload) {
      commit('clearError')
      const resultCategories = []

      try {
        const categories = await axios.get(environment.url + '/api/v1/categories/' + payload)

        if (categories.data.length !== 0) {
          categories.data.forEach((key) => {
            resultCategories.push(
              new Category(key.user_id, key.title, key.color, key.id)
            )
          })

          resultCategories.sort(function (a, b) {
            if (a.title > b.title) {
              return 1
            }
            if (a.title < b.title) {
              return -1
            }
            return 0
          });
        }

        commit('loadCategory', resultCategories)
      } catch (err) {
        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    },
    async createCategory ({ commit, getters }, payload) {
      commit('clearError')
      commit('setLoading', true)
      const resultCategories = getters.category

      try {
        const category = await axios.post(environment.url + '/api/v1/categories', payload)

        resultCategories.push(
          new Category(category.data.user_id, category.data.title, category.data.color, category.data.id)
        )

        resultCategories.sort(function (a, b) {
          if (a.title > b.title) {
            return 1
          }
          if (a.title < b.title) {
            return -1
          }
          return 0
        });

        commit('loadCategory', resultCategories)
        commit('setMessage', { status: 'success', message: i18n.t('records.category.add_success') })
      } catch (err) {
        commit('setLoading', false)

        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    },
    async editCategory ({ commit, getters }, payload) {
      commit('clearError')
      commit('setLoading', true)
      const categories = getters.category

      try {
        const editCategory = await axios.patch(environment.url + '/api/v1/categories/' + payload.id, payload)

        categories.forEach((element) => {
          if (element.id === editCategory.data.id) {
            element.user_id = editCategory.data.user_id
            element.title = editCategory.data.title
            element.color = editCategory.data.color
          }
        });

        categories.sort(function (a, b) {
          if (a.title > b.title) {
            return 1
          }
          if (a.title < b.title) {
            return -1
          }
          return 0
        });

        commit('loadCategory', categories)
        commit('setMessage', { status: 'success', message: i18n.t('records.category.edit_success') })
      } catch (err) {
        commit('setLoading', false)

        if (err.response.data) {
          commit('setMessage', { status: 'error', message: i18n.t(err.response.data.message) })
        } else {
          console.log(err)
        }

        throw err
      }
    }
  },
  getters: {
    category (state) {
      return state.category
    },
    categoryById (state) {
      return catId => {
        return state.category.find(cat => cat.id === catId)
      }
    }
  }
}
