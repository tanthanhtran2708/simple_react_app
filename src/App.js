import { Button, InputGroup } from 'react-bootstrap'
import React from 'react'
import { CommentModel, PostModel } from './models/'
import './style.scss'
export default class App extends React.Component {
  constructor() {
    super()
    this.state = { posts: [], text: "", commentContent:"", currentPostIndex: -1, editPostText:"", editCommentText:"", currentCommentIndex: -1, isPostEdditing: false, isCommentEditing: false }
    this.createAPost = this.createAPost.bind(this)
    this.onClickEdit = this.onClickEdit.bind(this)
    this.onFinishEdit = this.onFinishEdit.bind(this)
    this.onPressDeletePost = this.onPressDeletePost.bind(this)
  }
  onPressDeletePost(index) {
    let { posts } = this.state
    posts.splice(index, 1);
    this.setState({ posts: posts });
  }

  onPressDeleteComment(postIndex, commentIndex) {
    let { posts } = this.state
    posts[postIndex].comments.splice(commentIndex, 1);
    this.setState({ posts: posts });
  }

  onPressComment(index) {
    let { posts, commentContent } = this.state
    if (commentContent) {
      let comment = new CommentModel()
      comment.content = commentContent
      posts[index].comments.push(comment)
    }
    this.setState({ posts: posts, commentContent: "" });
  }

  onFinishEditComment(postIndex, commentIndex) {
    let { posts, editCommentText } = this.state
    if (editCommentText) {
      posts[postIndex].comments[commentIndex].content = editCommentText
    }
    this.setState({ posts: posts, editCommentText: "", currentCommentIndex: -1, currentPostIndex: -1 });
  }

  onFinishEdit(index) {
    let { posts, editPostText } = this.state
    if (editPostText) {
      posts[index].content = editPostText
    }
    this.setState({ currentPostIndex: -1, editPostText:"", posts: posts, isPostEdditing: false });
  }

  onClickEdit(index) {
    this.setState({ currentPostIndex: index, isPostEdditing: true });
  }

  onClickEditComment(postIndex, index) {
    this.setState({ currentCommentIndex: index, isCommentEditing: true, currentPostIndex: postIndex });
  }

  createAPost() {
    const text = this.state.text
    if (text) {
      const post = new PostModel()
      post.content = text
      this.setState({posts: [...this.state.posts, post ], text:""})
    }
  }

  renderComments(postIndex, comments) {
    return comments.map((comment, index) => {
      const { currentCommentIndex, currentPostIndex, isCommentEditing } = this.state
      return (
        <div className="p-2 m-2 d-flex flex-column align-items-start w-100">
          {
            currentCommentIndex === index &&  currentPostIndex === postIndex && isCommentEditing ? 
              <div className="p-2 comment-item w-100"> 
                 <input  value={this.state.editCommentText} onChange={(text) => { this.setState({ editCommentText: text.target.value })}} type="text" class="form-control w-100" placeholder="Leave your comment here ..." aria-describedby="basic-addon2"/>
              </div> :
              <div className="p-2 comment-item w-100">
                {comment.content}
              </div>
          }
          <div className="w-100 edit-btn mt-2 d-flex justify-content-end">
            {
              currentCommentIndex === index && currentPostIndex === postIndex && isCommentEditing ? 
                <div onClick={()=> this.onFinishEditComment(postIndex, index)} className="align-self-end">Finish</div> :
                <div onClick={()=> this.onClickEditComment(postIndex, index)} className="d-flex align-self-end">Edit</div>
            }
            <div className="ml-2" onClick={() => this.onPressDeleteComment(postIndex, index)}>Delete</div>
          </div>
        </div>
      )
    })
  }

  renderCommentBar(index) {
    const { currentPostIndex, isPostEdditing, posts } = this.state
    return (
      <div class="input-group mb-3  mt-3">
        <input onFocus={() => this.setState({ currentPostIndex: index })} onBlur={() => this.setState({ currentPostIndex: -1, commentContent: currentPostIndex === index ? this.state.commentContent : "" })} value={currentPostIndex === index ? this.state.commentContent : ""} onChange={(text) => { this.setState({ commentContent: text.target.value })}} type="text" class="form-control" placeholder="Leave your comment here ..." aria-describedby="basic-addon2"/>
          <div class="input-group-append">
            <button onClick={() => { this.onPressComment(index) }} class="btn btn-outline-secondary" type="button">Comment</button>
          </div>
          <div class="input-group-append">
            {currentPostIndex === index && isPostEdditing ? <button onClick={()=> this.onFinishEdit(index)} class="btn btn-outline-secondary" type="button">Finish</button> : <button onClick={()=> this.onClickEdit(index)} class="btn btn-outline-secondary" type="button">Edit</button>}
        </div>
        <div class="input-group-append">
          <button onClick={() => { this.onPressDeletePost(index) }} class="btn btn-outline-secondary" type="button">Delete</button>
        </div>
      </div>
      )
  }

  renderItem() {
    const { posts, currentPostIndex, isPostEdditing } = this.state
    return posts.map((post, index) => {
      return (
        <div className="w-100 p-3 mt-2  feed-container">
          {currentPostIndex === index && isPostEdditing ?
            <input value={this.state.editPostText} onChange={(text)=>this.setState({editPostText: text.target.value})} placeholder="What is going on? " className="w-100 h-75 input-field p-2 mb-2" /> :
            <div className="content-container p-2">
              <div>{post.content}</div>
            </div>
          }
          {this.renderComments(index, post.comments)}
          <div>
            {this.renderCommentBar(index)}
          </div>
        </div>
      )
    })
  }
  renderInputForm() {
    return (
      <div className="h-25 p-3 input-container d-flex flex-column justify-content-center">
        <input value={this.state.text} onChange={(text)=>this.setState({text: text.target.value})} placeholder="What is going on?" className="w-100 h-75 input-field p-2 mb-2" />
        <Button onClick={()=> this.createAPost()} className="w-25 bg-warning btn-outline-warning  btn text-white" >Post now</Button>
      </div>
    )
  }
  render() {
    return (
      <div className="main-wrapper p-3 container-fluid">
        {this.renderInputForm()}
        {this.renderItem()}
      </div>
    )
  }
}
//