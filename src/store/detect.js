export default {
    state: {
        model: null,
        predictions: [],
        loaded: false,
    },
    mutations: {
        setModel(state, newModel) {
            state.model = newModel
        },
        setLoaded(state, newLoaded) {
            state.loaded = newLoaded
        },
        setPredictions(state, newPredictions) {
            state.predictions.push(newPredictions)
        }
    },
    actions: {
        setPredictions(context, newPredictions) {
            context.commit('setPredictions', newPredictions)
        }
    }
}