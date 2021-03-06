import { SET_SCREAMS, LOADING_DATA, LOADING_DATA2, LIKE_SCREAM, UNLIKE_SCREAM, LIKING_SCREAM, DELETE_SCREAM, 
        SET_ERRORS, POST_SCREAM, CLEAR_ERRORS, LOADING_UI, SET_SCREAM, 
        STOP_LOADING_UI, SUBMIT_COMMENT, LIKE_COMMENT, UNLIKE_COMMENT, LIKING_COMMENT, DELETE_COMMENT } from '../types';
import axios from 'axios';

//get all screams
export const getScreams = () => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get('/screams')
        .then(res => {
            dispatch({ 
                type: SET_SCREAMS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: SET_SCREAMS,
                payload: []
            })
        })
}

export const getScream = (screamId) => dispatch => {
    dispatch({ type: LOADING_UI });
    axios.get(`/scream/${screamId}`)
        .then(res => {
            dispatch({
                type: SET_SCREAM,
                payload: res.data
            });
            dispatch({ type: STOP_LOADING_UI })
        })
        .catch(err => console.log(err));
}

//Post a scream
export const postScream = (newScream) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.post('/scream', newScream)
        .then(res => {
            dispatch({
                type: POST_SCREAM,
                payload: res.data
            });
            dispatch( clearErrors() );
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        })
}

//like a scream
export const likeScream = (screamId) => dispatch => {
    dispatch({ type: LIKING_SCREAM });
    axios.get(`/scream/${screamId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_SCREAM,
                payload: res.data
            })
        })
        .catch(err => console.log(err));
}

//unlike a scream
export const unlikeScream = (screamId) => dispatch => {
    dispatch({ type: LIKING_SCREAM });
    axios.get(`/scream/${screamId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_SCREAM,
                payload: res.data
            })
        })
        .catch(err => console.log(err));
}

//submit a comment
export const submitComment = (screamId, commentData) => (dispatch) => {
    dispatch({ type: LOADING_DATA2 });
    axios.post(`/scream/${screamId}/comment`, commentData)
        .then(res => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
}

//delete a scream
export const deleteScream = (screamId) => (dispatch) => {
    axios.delete(`/scream/${screamId}`)
        .then(() => {
            dispatch({ type: DELETE_SCREAM, payload: screamId})
        })
        .catch(err => console.log(err));
}

export const getUserData = (userHandle) => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get(`/user/${userHandle}`)
        .then(res => {
            dispatch({
                type: SET_SCREAMS,
                payload: res.data.screams
            });
        })
        .catch(() => {
            dispatch({
                type: SET_SCREAMS,
                payload: null
            })
        })
}

//like a comment
export const likeComment = (screamId, commentId) => dispatch => {
    dispatch({ type: LIKING_COMMENT });
    axios.get(`/screams/${screamId}/comment/${commentId}/like`)
        .then(res => {
            dispatch({
                type: LIKE_COMMENT,
                payload: res.data
            })
        })
        .catch(err => console.log(err));
}

//unlike a comment
export const unlikeComment = (screamId, commentId) => dispatch => {
    dispatch({ type: LIKING_COMMENT });
    axios.get(`/screams/${screamId}/comment/${commentId}/unlike`)
        .then(res => {
            dispatch({
                type: UNLIKE_COMMENT,
                payload: res.data
            })
        })
        .catch(err => console.log(err));
}

//delete a comment
export const deleteComment = (screamId, commentId) => (dispatch) => {
    axios.delete(`/screams/${screamId}/comment/${commentId}`)
        .then(() => {
            dispatch({ type: DELETE_COMMENT, payload: commentId})
        })
        .catch(err => console.log(err));
}

export const clearErrors = () => dispatch => {
    dispatch({ type: CLEAR_ERRORS });
}