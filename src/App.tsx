import CreatePost from "./components/createPost/CreatePost";
import Suggested from "./components/suggested/Suggested";
import Header from "./components/header/Header";
import Search from "./components/search/Search";
import Feed from "./components/feed/Feed";
import "react-quill/dist/quill.snow.css";
import "./App.css";
import Trending from "./components/trending/Trending";

function App() {
	return (
		<div className="app">
			<div className="container">
				<Header />
				<div className="content">
					<div className="feed">
						<CreatePost />
						<Feed />
					</div>
					<div className="side-bar">
						<Search />
						<Suggested />
						<Trending />
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
