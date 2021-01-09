import {
    SET_SCREAMS, LIKE_SCREAM, UNLIKE_SCREAM, LIKING_SCREAM, LOADING_DATA, LOADING_DATA2, 
    DELETE_SCREAM, POST_SCREAM, SET_SCREAM, SUBMIT_COMMENT,
    LIKE_COMMENT, UNLIKE_COMMENT, LIKING_COMMENT, DELETE_COMMENT, SET_ERRORS, CLEAR_ERRORS
} from '../types';

const initialState = {
    screams: [],
    scream: {},
    loading: false,
    loading2: false
};

export default function (state = initialState, action) {
    let index;
    switch (action.type) {
        case SET_ERRORS:
            return {
                ...state,
                loading2: false
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                loading2: false
            };
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case LOADING_DATA2:
            return {
                ...state,
                loading2: true
            }
        case LIKING_SCREAM:
            return {
                ...state,
                loading3: true
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
            if (state.scream.screamId === action.payload.screamId) {
                state.scream = action.payload;
            }
            return {
                ...state,
                loading3: false
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
                loading2: false,
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
                ...state,
                loading4: false
            };
        case LIKING_COMMENT:
            return {
                ...state,
                loading4: true
            }
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