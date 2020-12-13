import React from "react";

interface State {}
interface Props {}

export default class DomainError extends React.Component<Props, State> {
	public render() {
		return (
			<span>
				Incorrect domain. In order for this to work properly you will need to update your 'hosts' file.
				<div className="mt-1" />
				<br />
				{window.navigator.platform === "Win32" ? (
					<>
						- Open Notepad as Administrator
						<br />- Select '<code>File</code>' then '<code>Open</code>'
						<br />- Navigate to '<code>C:\Windows\System32\drivers\etc\</code>' and select the '<code>hosts</code>'
						file
					</>
				) : window.navigator.platform.toLowerCase().includes("linux") ? (
					<>
						- Open '<code>/etc/hosts</code>' in sudo mode
					</>
				) : window.navigator.platform.toLowerCase().includes("mac") ? (
					<>
						- Open '<code>/private/etc/hosts</code>' in sudo mode
					</>
				) : (
					<>
						- Open{" "}
						<a
							className="hover:underline text-blue-600"
							href="https://www.google.com/search?q=where+is+my+hosts+file&oq=where+is+my+hosts+file&aqs=chrome..69i57j0l5.4430j0j9&sourceid=chrome&ie=UTF-8"
							target="_blank"
							rel="noreferrer">
							your operating system's '<code>hosts</code>'
						</a>{" "}
						file
					</>
				)}
				<br />- With the file open, add '<code>{window.location.hostname} hard-drive.live</code>' below the any content
				<br />- Save the file and{" "}
				<a className="hover:underline text-blue-600" href="http://hard-drive.live">
					click here
				</a>
				. You should be redirected to http://hard-drive.live and be able to view the network hard drive
			</span>
		);
	}
}
