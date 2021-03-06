const { db } = require('../util/admin');

exports.getAllScreams = (req, res) => {
    db.collection('screams').orderBy('createdAt', 'desc').get()
      .then(data => {
          let screams = [];
        data.forEach(doc => {
          screams.push({
            screamId: doc.id,
            ...doc.data()
          });
        });
        return res.json(screams);
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: err.code });
      });
  }

  exports.postOneScream = (req, res) => {
    if(req.body.body.trim() === ''){
      return res.status(400).json({ body: 'Body must not be empty' });
    }
    
    const newScream = {
      body: req.body.body,
      userHandle: req.user.handle,
      userImage: req.user.imageUrl,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0
    };
  
    db
      .collection('screams')
      .add(newScream)
      .then(doc => {
        const resScream = newScream;
        resScream.screamId = doc.id;
        res.json(resScream);
      })
      .catch(err => {
        res.status(500).json({ error: 'something went wrong'});
        console.error(err);
      });
  };

  // get one scream
  exports.getScream = (req, res) => {
    let screamData = {};
    db.doc(`/screams/${req.params.screamId}`).get()
      .then(doc => {
        if(!doc.exists){
          return res.status(404).json({ error: 'Scream not found'});
        }
        screamData = doc.data();
        screamData.screamId = doc.id;
        return db.collection('comments').orderBy('createdAt', 'desc').where('screamId', '==', req.params.screamId).get();
      })
      .then(data => {
        screamData.comments = [];
        data.forEach(doc => {
          commentData = { commentId: doc.id, ...doc.data() };
          screamData.comments.push(commentData);
        });
        return res.json(screamData);
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };

exports.commentOnScream = (req, res) => {
  if(req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty'});

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    likeCount: 0
  };

  db.doc(`/screams/${req.params.screamId}`).get()
    .then(doc => {
      if(!doc.exists){
        return res.status(404).json({ error: 'Scream not found' });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1});
    })
    .then(() => {
      return db.collection('comments').add(newComment);
    })
    .then((doc) => {
      const resComment = newComment;
      resComment.commentId = doc.id;
      res.json(resComment);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
};

//like a scream
exports.likeScream = (req, res) => {
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId).limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData;

  screamDocument.get()
    .then(doc => {
      if(doc.exists){
        screamData = doc.data();
        screamData.screamId = doc.id;
        return db.collection('comments').orderBy('createdAt', 'desc').where('screamId', '==', req.params.screamId).get();
      } else {
        return res.status(404).json({ error: 'Scream not found' });
      }
    })
    .then((data) => {
      screamData.comments = [];
      data.forEach((doc) => {
        commentData = { commentId: doc.id, ...doc.data() };
        screamData.comments.push(commentData);
      });
      return likeDocument.get();
    })
    .then(data => {
      if(data.empty){
        return db.collection('likes').add({
          screamId: req.params.screamId,
          userHandle: req.user.handle
        })
        .then(() => {
          screamData.likeCount++;
          return screamDocument.update({ likeCount: screamData.likeCount });
        })
        .then(() => {
          return res.json(screamData);
        });
      } else {
        return res.status(400).json({ error: 'Scream already liked' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeScream = (req, res) => {
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId).limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData;

  screamDocument.get()
    .then(doc => {
      if(doc.exists){
        screamData = doc.data();
        screamData.screamId = doc.id;
        return db.collection('comments').orderBy('createdAt', 'desc').where('screamId', '==', req.params.screamId).get();
      } else {
        return res.status(404).json({ error: 'Scream not found' });
      }
    })
    .then((data) => {
      screamData.comments = [];
      data.forEach((doc) => {
        commentData = { commentId: doc.id, ...doc.data() };
        screamData.comments.push(commentData);
      });
      return likeDocument.get();
    })
    .then(data => {
      if(data.empty){
        return res.status(400).json({ error: 'Scream not liked' });
      } else {
        return db.doc(`likes/${data.docs[0].id}`).delete()
          .then(() => {
            screamData.likeCount--;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            res.json(screamData);
          })
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// delete a scream
exports.deleteScream = (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);
  document.get()
    .then(doc => {
      if(!doc.exists){
        return res.status(404).json({ error: 'Scream not found' });
      }
      if(doc.data().userHandle !== req.user.handle){
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'Scream deleted successfully' });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

//like a comment
exports.likeComment = (req, res) => {
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('commentId', '==', req.params.commentId).limit(1);

  const commentDocument = db.doc(`/comments/${req.params.commentId}`);

  let commentData;

  commentDocument.get()
    .then(doc => {
      if(doc.exists){
        commentData = doc.data();
        commentData.commentId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Comment not found' });
      }
    })
    .then(data => {
      if(data.empty){
        return db.collection('likes').add({
          commentId: req.params.commentId,
          userHandle: req.user.handle
        })
        .then(() => {
          commentData.likeCount++;
          return commentDocument.update({ likeCount: commentData.likeCount });
        })
        .then(() => {
          return res.json(commentData);
        });
      } else {
        return res.status(400).json({ error: 'Comment already liked' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeComment = (req, res) => {
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('commentId', '==', req.params.commentId).limit(1);

  const commentDocument = db.doc(`/comments/${req.params.commentId}`);

  let commentData;

  commentDocument.get()
    .then(doc => {
      if(doc.exists){
        commentData = doc.data();
        commentData.commentId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Comment not found' });
      }
    })
    .then(data => {
      if(data.empty){
        return res.status(400).json({ error: 'Comment not liked' });
      } else {
        return db.doc(`likes/${data.docs[0].id}`).delete()
          .then(() => {
            commentData.likeCount--;
            return commentDocument.update({ likeCount: commentData.likeCount });
          })
          .then(() => {
            return res.json(commentData);
          })
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// delete a comment
exports.deleteComment = (req, res) => {
  const document = db.doc(`/comments/${req.params.commentId}`);
  document.get()
    .then(doc => {
      if(!doc.exists){
        return res.status(404).json({ error: 'Comment not found' });
      }
      if(doc.data().userHandle !== req.user.handle){
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      db.doc(`/screams/${req.params.screamId}`).get()
      .then(doc => {
        if(!doc.exists){
          return res.status(404).json({ error: 'Scream not found' });
        }
        return doc.ref.update({ commentCount: doc.data().commentCount - 1 });
      })
      .then(() => {
        res.json({ message: 'Comment deleted successfully' });
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
};