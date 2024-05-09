import { quillFormats, quillModules } from "../../utils/quillConigs";
import { Delta as TypeDelta, Sources } from "quill";
import Button from "../button/Button";
import ReactQuill from "react-quill";
import { useState } from "react";
import "./CreatePost.css";

export default function CreatePost() {
	const [post, setPost] = useState<TypeDelta | null>();
	function handlePost(_value: string, _delta: TypeDelta, _source: Sources, editor: ReactQuill.UnprivilegedEditor) {
		setPost(editor.getContents());
	}

	console.log("post", post);

	return (
		<div className="quill-wrapper">
			<ReactQuill
				theme="snow"
				onChange={handlePost}
				modules={quillModules}
				formats={quillFormats}
				placeholder="Make a post..."
				className="ql-create"
			/>
			{post && post.ops && post.ops.length > 0 && post.ops[0].insert !== "\n" && (
				<Button onClick={() => {}} variant="secondary" style={{ marginBottom: "10px", marginLeft: "10px" }}>
					Post
				</Button>
			)}
		</div>
	);
}
