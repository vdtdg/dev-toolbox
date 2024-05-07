import React, { useState } from "react";
import "./emoji-picker.css";
import EmojiPicker from "emoji-picker-react";

const EmojiPickerTool = () => {
	const [chosenEmoji, setChosenEmoji] = useState(null);

	const onEmojiClick = (emojiObject) => {
		navigator.clipboard.writeText(emojiObject.emoji);
		console.log(emojiObject.emoji);
		setChosenEmoji(emojiObject);
	};

	return (
		<section className="tool-section emoji-picker-wrapper">
			<h3 className="tool-title">Emoji Picker</h3>
			<p>Click on an emoji to copy it to your clipboard.</p>
			<div className="emoji-container">
				{chosenEmoji ? <span>You chose: {chosenEmoji.emoji}</span> : <span>No emoji Selected</span>}
				<EmojiPicker onEmojiClick={onEmojiClick} />
			</div>
		</section>
	);
};

export default EmojiPickerTool;
