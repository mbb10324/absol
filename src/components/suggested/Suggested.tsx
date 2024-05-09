import { mockFeed } from "../../utils/mockFeed";
import "./Suggested.css";

export default function Suggested() {
	return (
		<div className="suggested-users">
			<h2>Suggested</h2>
			{mockFeed.map((user, index) => {
				if (index > 4) return null;
				return (
					<div className="suggested-user" key={index}>
						<img src={user.profilePic} alt="profile" />
						<div className="suggested-user-info">
							<h3>{user.name}</h3>
							<h4>@{user.username}</h4>
						</div>
					</div>
				);
			})}
		</div>
	);
}
