import { mockFeed } from "../../utils/mockFeed";
import Button from "../button/Button";
import "./Feed.css";

export default function Feed() {
	return (
		<>
			{mockFeed.map((user, index) => (
				<div className="post" key={index}>
					<div className="post-header">
						<img src={user.profilePic} alt="profile" />
						<div className="post-header-info">
							<h3>{user.name}</h3>
							<h4>@{user.username}</h4>
						</div>
					</div>
					<div className="post-content">
						<p>{user.content}</p>
					</div>
					<div className="post-footer">
						<h4>{user.time}</h4>
						<Button onClick={() => {}}>
							<span>Likes - {user.likes}</span>
						</Button>
						<Button onClick={() => {}}>
							<span>Comments - {user.comments}</span>
						</Button>
						<Button onClick={() => {}}>
							<span>Shares - {user.shares}</span>
						</Button>
					</div>
				</div>
			))}
		</>
	);
}
