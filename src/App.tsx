import { useState } from "react";
import "./App.css";
import Header from "./components/header/Header";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { quillFormats, quillModules } from "./utils/quillConigs";
import { mockFeed } from "./utils/mockFeed";

function App() {
	const [post, setPost] = useState("");
	function handlePost(content: unknown, delta: unknown, source: unknown, editor: unknown) {
		// @ts-expect-error - quill editor
		const theDelta = editor.getContents();
		setPost(theDelta);
	}
	console.log(post);
	return (
		<div className="app">
			<div className="container">
				<Header />
				<div className="feed-wrapper">
					<div className="feed">
						<ReactQuill
							theme="snow"
							onChange={handlePost}
							modules={quillModules}
							formats={quillFormats}
							placeholder="Make a post..."
							className="ql-create"
						/>
						{mockFeed.map((user, index) => (
							<div className="post" key={index}>
								<div className="post-header">
									<img src={user.profilePic} alt="profile" />
									<div className="post-header-info">
										<h3>{user.name}</h3>
										<h4>@{user.username}</h4>
										<h4>{user.time}</h4>
									</div>
								</div>
								<div className="post-content">
									<p>{user.content}</p>
								</div>
								<div className="post-footer">
									<div className="post-footer-btns">
										<button>
											<span>Like</span>
											<span>{user.likes}</span>
										</button>
										<button>
											<span>Comment</span>
											<span>{user.comments}</span>
										</button>
										<button>
											<span>Share</span>
											<span>{user.shares}</span>
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="suggested">
						<h2>Suggested</h2>
						<div className="suggested-users">
							{mockFeed.map((user, index) => (
								<div className="suggested-user" key={index}>
									<img src={user.profilePic} alt="profile" />
									<h3>{user.name}</h3>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
