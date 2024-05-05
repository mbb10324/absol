import "./Button.css";

type ButtonProps = {
	onClick: () => void;
	className?: string;
	children: React.ReactNode;
};

export default function Button(props: ButtonProps) {
	return (
		<button onClick={props.onClick} className={props.className || "absol-btn"}>
			{props.children}
		</button>
	);
}
