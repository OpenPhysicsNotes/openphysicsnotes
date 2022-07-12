
import './ProgressBar.css'

export function ProgressBar(props: {
	progress: number;
	text?: string;
}) {
	return (
		<div className='app-explorer-progress-bar'>
			<div className='app-explorer-progress-bar-progress' style={{width: props.progress + "%", display:'flex'}}>
				<div className='app-explorer-progress-bar-progress-text'>
					{props.text ? props.text : ''}
				</div>
				<div className='app-explorer-progress-bar-progress-percentage-text'>
					{props.progress.toFixed(2) + "%"}
				</div>
			</div>
		</div>
	);
}
