import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import LikeButton2 from './LikeButton2';
import DeleteComment from './DeleteComment';

//MUI imports
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

//Redux
import { connect } from 'react-redux';

const styles = theme => ({
    ...theme.spread,
    commentImage: {
        maxWidth: '100%',
        height: 100,
        objectFit: 'cover',
        borderRadius: '50%'
    },
    commentData: {
        marginLeft: 20
    }
});

class Comments extends Component {
    render() {
        const { comments, classes, authenticated, handle } = this.props;
        return (
            <Grid container>
                {comments.map((comment, index) => {
                    const { screamId, commentId, body, createdAt, userImage, userHandle, likeCount } = comment;
                    const deleteButton = authenticated && userHandle === handle ? (
                        <DeleteComment screamId={screamId} commentId={commentId}/>
                    ) : null
                    return (
                        <Fragment key={createdAt}>
                            <Grid item sm={12}>
                                <Grid container>
                                    <Grid item sm={2}>
                                        <img src={userImage} alt="comment" className={classes.commentImage}/>
                                    </Grid>
                                    <Grid item sm={9}>
                                        <div className={classes.commentData}>
                                            <Typography
                                                variant="h5"
                                                component={Link}
                                                to={`/users/${userHandle}`}
                                                color="primary">
                                                    {userHandle}
                                            </Typography>
                                            <LikeButton2 screamId={screamId} commentId={commentId}/>
                                            {likeCount} Likes
                                            {deleteButton}
                                            <br/>
                                            <Typography variant="body2" color="textSecondary">
                                                {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                            </Typography>
                                            <hr className={classes.invisibleSeparator}/>
                                            <Typography variant="body1">{body}</Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {index !== comments.length - 1 && (
                                <hr className={classes.visibleSeparator}/>
                            )}
                        </Fragment>
                    )
                })}
            </Grid>
        )
    }
}

Comment.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    handle: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired
}

export default withStyles(styles)(Comments);