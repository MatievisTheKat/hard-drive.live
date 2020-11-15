import React from "react";

interface State {}
interface Props {
	bytes: number;
}

export default class Size extends React.Component<Props, State> {
	public render() {
		const b = this.props.bytes;
		const mb = Math.round(this.props.bytes / 1024 / 1024);
		const gb = Math.round(mb / 1024);

		return (
			<span className="float-right text-center mr-10 text-gray-500 text-sm">
				{gb > 0 ? `${gb}GB` : mb > 0 ? `${mb}MB` : `${b}B`}
			</span>
		);
	}
}
