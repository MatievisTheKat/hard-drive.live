import React from "react";

interface State {}
interface Props {}

export default class Tooltip extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props);
	}

	public render() {
		return (
			<div className="relative mx-2">
				<div className="bg-black text-white text-xs rounded py-1 px-4 right-0 bottom-full">
					{this.props.children}
					<svg
						className="absolute text-black h-2 w-full left-0 top-full"
						x="0px"
						y="0px"
						viewBox="0 0 255 255"
						xmlSpace="preserve">
						<polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
					</svg>
				</div>
			</div>
		);
	}
}
