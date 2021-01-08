import { SET_SCREAMS, LIKE_SCREAM, UNLIKE_SCREAM, LOADING_DATA,
        DELETE_SCREAM, POST_SCREAM, SET_SCREAM, SUBMIT_COMMENT,
        LIKE_COMMENT, UNLIKE_COMMENT, DELETE_COMMENT } from '../types';

const initialState = {
    screams: [],
    scream: {},
    loading: false
};

export default function(state = initialState, action){
    let index;
    switch(action.type){
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case SET_SCREAMS:
            return {
                ...state,
                screams: action.payload,
                loading: false
            }
        case SET_SCREAM:
            return {
                ...state,
                scream: action.payload
            }
        case LIKE_SCREAM:
        case UNLIKE_SCREAM:
            index = state.screams.findIndex((scream) => scream.screamId === action.payload.screamId);
            state.screams[index] = action.payload;
            if(state.scream.screamId === action.payload.screamId){
                state.scream = action.payload;
            }
            return {
                ...state
            }
        case DELETE_SCREAM:
            index = state.screams.findIndex(scream => scream.screamId === action.payload);
            state.screams.splice(index, 1);
            return {
                ...state
            };
        case POST_SCREAM:
            return {
                ...state,
                screams: [
                    action.payload,
                    ...state.screams
                ]
            }
        case SUBMIT_COMMENT:
            return {
                ...state,
                scream: {
                    ...state.scream,
                    commentCount: state.scream.commentCount + 1,
                    comments: [action.payload, ...state.scream.comments]
                }
            }
        case LIKE_COMMENT:
        case UNLIKE_COMMENT:
            index = state.scream.comments.findIndex((comment) => comment.commentId === action.payload.commentId);
            state.scream.comments[index] = action.payload;
            return {
                ...state
            };
        case DELETE_COMMENT:
            index = state.scream.comments.findIndex((comment) => comment.commentId === action.payload);
            state.scream.comments.splice(index, 1);
            state.scream.commentCount--;
            return {
                ...state
            };
        default:
            return state;
    }
}