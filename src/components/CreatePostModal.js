import React, { useState } from 'react';
import '../styles/CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
  const [postContent, setPostContent] = useState('');

  const handleContentChange = (e) => {
    setPostContent(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(postContent);
    setPostContent('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create Post</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <textarea
            value={postContent}
            onChange={handleContentChange}
            placeholder="What's on your mind?"
            className="post-textarea"
          />
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="submit-button" onClick={handleSubmit}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;