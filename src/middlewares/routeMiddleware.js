import lsConst from '../constants/localStorage';
import { push } from 'react-router-redux';
import { login, loadConnections } from '../actions/login';
import { init } from '../actions/app';
import { getFromStorage } from '../helpers/storage';

const paths = ['/', '/login'];

export default store => next => action => {
    if (action.type === '@@router/LOCATION_CHANGE') {
        const { dispatch } = store;
        const state = store.getState();

        if (!state.app.init) {
            lsConst.CONNECTIONS
                |> getFromStorage('[]')
                |> JSON.parse
                |> loadConnections
                |> dispatch;
            dispatch(init());
        }

        //on enter or login
        if (paths.find(x => x === action.payload.pathname) && !state.app.init) {
            (state.app.autorized ? '/sql' : '/login') |> push |> dispatch;
        } else {
            !state.app.autorized && !state.login.fetching &&
            store.getState().login.connections.find(x => x.authorized)
                |> (_ => _ |> login |> dispatch)
                |> (async auth => await !auth && (push('/login') |> dispatch));
        }
    }

    next(action);
};