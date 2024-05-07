import Button from "../button/Button";
import "./HeaderButtonGroup.css";

type HeaderButtonGroupProps = {
	headerButtons: {
		title: string;
		function: () => void;
	}[];
	selected: string;
};

export default function HeaderButtonGroup(props: HeaderButtonGroupProps) {
	const { headerButtons, selected } = props;

	return (
		<div className="header-links">
			{headerButtons.map((headerButton, index) => (
				<Button key={index} onClick={headerButton.function} variant="secondary" selected={selected === headerButton.title}>
					{headerButton.title}
				</Button>
			))}
		</div>
	);
}
