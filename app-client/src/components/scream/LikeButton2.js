import React, { Component } from 'react'
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

//Redux
import { connect } from 'react-redux'
import { likeComment, unlikeComment } from '../../redux/actions/dataActions';

class LikeButton2 extends Component {
    likedComment = () => {
        if(this.props.user.likes && this.props.user.likes.find((like) => like.commentId === this.props.commentId))
            return true;
        else return false;
    };
    likeComment = () => {
        this.props.likeComment(this.props.screamId, this.props.commentId);
    };
    unlikeComment = () => {
        this.props.unlikeComment(this.props.screamId, this.props.commentId);
    };
    render() {
        const { authenticated } = this.props.user;
        const { data: { loading4 } } = this.props;
        const likeButton = !authenticated ? (
            <Link to="/login">
                <MyButton tip="Like">
                        <FavoriteBorder color="primary"/>
                </MyButton>
            </Link>
        ) : (
            this.likedComment() ? (
                <MyButton tip="Undo like" disabled={loading4} onClick={this.unlikeComment}>
                    <FavoriteIcon color="primary"/>
                </MyButton>
            ) : (
                <MyButton tip="Like" disabled={loading4} onClick={this.likeComment}>
                    <FavoriteBorder color="primary"/>
                </MyButton>
            )
        );

        return likeButton;
    }
}

LikeButton2.propTypes = {
    user: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    commentId: PropTypes.string.isRequired,
    likeComment: PropTypes.func.isRequired,
    unlikeComment: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data
})

const mapActionsToProps = {
    likeComment,
    unlikeComment
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton2);
