import "./Button.css";

type ButtonProps = {
	onClick: () => void;
	className?: string;
	children: React.ReactNode;
	variant?: "primary" | "secondary";
	selected?: boolean;
};

export default function Button(props: ButtonProps) {
	const { onClick, className, children, variant = "primary", selected = false } = props;
	const thisBackgroundColor = variant === "primary" ? "var(--primary-background)" : "var(--secondary-background)";
	const thisBorderColor = selected ? "var(--primary-text)" : variant === "primary" ? "var(--primary-background)" : "var(--secondary-background)";

	return (
		<button
			onClick={onClick}
			className={className || "absol-btn"}
			style={{ backgroundColor: thisBackgroundColor, borderColor: thisBorderColor, pointerEvents: selected ? "none" : "all" }}
		>
			{children}
		</button>
	);
}
