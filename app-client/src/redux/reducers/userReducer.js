import { SET_AUTHENTICATED, SET_UNAUTHENTICATED, UNLIKE_SCREAM } from '../types';
import { SET_USER, LOADING_USER, LIKE_SCREAM, MARK_NOTIFICATIONS_READ, LIKE_COMMENT, UNLIKE_COMMENT } from '../types';

const initialState = {
    authenticated: false,
    credentials: {},
    loading: false,
    likes: [],
    notifications: []
};

export default function(state = initialState, action){
    switch(action.type){
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case LIKE_SCREAM:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        screamId: action.payload.screamId
                    }
                ]
            }
        case UNLIKE_SCREAM:
            return {
                ...state,
                likes: state.likes.filter((like) => like.screamId !== action.payload.screamId)
            }
        case LIKE_COMMENT:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        commentId: action.payload.commentId
                    }
                ]
            }
        case UNLIKE_COMMENT:
            return {
                ...state,
                likes: state.likes.filter((like) => like.commentId !== action.payload.commentId)
            }
        case MARK_NOTIFICATIONS_READ:
            state.notifications.forEach(not => not.read = true);
            return {
                ...state
            };
        default:
            return state;
    }
}