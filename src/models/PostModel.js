class PostModel {
	constructor(content) {
	  this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	  this.content = content
	  this.comments = []
	}
}
export default PostModel