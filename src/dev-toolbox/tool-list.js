import Pomodoro from "./tools/pomodoro/pomodoro";
import CronTab from "./tools/crontab/crontab";
import LevenshteinCalculator from "./tools/levenshtein-distance/levenshtein-distance";
import UriEncoderDecoder from "./tools/encoder-decoder/uri-encoder-decoder";
import HtmlEncoderDecoder from "./tools/encoder-decoder/html-encoder-decoder";
import Base64EncoderDecoder from "./tools/encoder-decoder/base64-encoder-decoder";
import MD5Hasher from "./tools/hasher/md5-hasher";
import SHA1Hasher from "./tools/hasher/sha1-hasher";
import SHA256Hasher from "./tools/hasher/sha256-hasher";
import SHA512Hasher from "./tools/hasher/sha512-hasher";
import RIPEMD160Hasher from "./tools/hasher/ripemd-160-hasher";
import TimestampToTime from "./tools/time/timestamp-to-time";
import ChangeBaseHelper from "./tools/number/change-base-helper";
import AsciiReferenceTable from "./tools/ascii/ascii-reference-table";
import HelpMeStuckInVim from "./tools/vim/help-me-stuck-in-vim";
import Ipv4Helper from "./tools/network/ipv4-helper";
import React from "react";
import LinkedinTimestampParser from "./tools/linkedin-timestamp-parser/linkedin-timestamp-parser";
import FileDiff from "./tools/file-diff/file-diff";
import BinaryHelper from "./tools/binary-helper/binary-helper";
import ImageHelper from "./tools/image-helper/image-helper";
import HttpRequest from "./tools/http-request/http-request";
import JwtHelper from "./tools/jwt-helper/jwt-helper";
import ColorPicker from "./tools/color-picker/color-picker";
import ColorShadesGenerator from "./tools/color-shades-generator/color-shades-generator";
import EmojiPickerTool from "./tools/emoji-picker/emoji-picker";

export const toolList = [
	{
		path: "pomodoro",
		name: "Pomodoro",
		element: <Pomodoro />,
		category: "Productivity",
	},
	{
		path: "crontab",
		name: "Cron Tab Helper",
		element: <CronTab />,
		category: "Productivity",
	},
	{
		path: "levenshtein-distance",
		name: "Levenshtein Distance Calculator",
		element: <LevenshteinCalculator />,
		category: "Cryptography",
	},
	{
		path: "uri-encoder-decoder",
		name: "Uri Encoder - Decoder",
		element: <UriEncoderDecoder />,
		category: "Cryptography",
	},
	{
		path: "html-encoder-decoder",
		name: "HTML Encoder - Decoder",
		element: <HtmlEncoderDecoder />,
		category: "Cryptography",
	},
	{
		path: "base64-encoder-decoder",
		name: "Base64 Encoder - Decoder",
		element: <Base64EncoderDecoder />,
		category: "Cryptography",
	},
	{
		path: "md5-hasher",
		name: "MD5 Hasher",
		element: <MD5Hasher />,
		category: "Cryptography",
	},
	{
		path: "sha1-hasher",
		name: "SHA1 Hasher",
		element: <SHA1Hasher />,
		category: "Cryptography",
	},
	{
		path: "sha256-hasher",
		name: "SHA256 Hasher",
		element: <SHA256Hasher />,
		category: "Cryptography",
	},
	{
		path: "sha512-hasher",
		name: "SHA512 Hasher",
		element: <SHA512Hasher />,
		category: "Cryptography",
	},
	{
		path: "ripemd-160-hasher",
		name: "RIPEMD-160 Hasher",
		element: <RIPEMD160Hasher />,
		category: "Cryptography",
	},
	{
		path: "timestamp-to-time",
		name: "Timestamp to time",
		element: <TimestampToTime />,
		category: "Time",
	},
	{
		path: "linkedin-post-date-parser",
		name: "LinkedIn Post Date Parser",
		element: <LinkedinTimestampParser />,
		category: "Time",
	},
	{
		path: "change-base-helper",
		name: "Change Base Helper",
		element: <ChangeBaseHelper />,
		category: "Number",
	},
	{
		path: "ascii-reference-table",
		name: "ASCII Reference Table",
		element: <AsciiReferenceTable />,
		category: "Misc",
	},
	{
		path: "help-me-stuck-in-vim",
		name: "Help me I'm stuck in Vim!",
		element: <HelpMeStuckInVim />,
		category: "Misc",
	},
	{
		path: "network-ipv4-helper",
		name: "IPv4 Helper",
		element: <Ipv4Helper />,
		category: "Number",
	},
	{
		path: "binary-helper",
		name: "Binary Helper",
		element: <BinaryHelper />,
		category: "Number",
	},
	{
		path: "image-helper",
		name: "Image Helper",
		element: <ImageHelper />,
		category: "Misc",
	},
	{
		path: "file-diff",
		name: "File Diff",
		element: <FileDiff />,
		category: "Misc",
	},
	{
		path: "http-request",
		name: "HTTP Request",
		element: <HttpRequest />,
		category: "Network",
	},
	{
		path: "jwt-helper",
		name: "JWT Helper",
		element: <JwtHelper />,
		category: "Cryptography",
	},
	{
		path: "color-picker",
		name: "Color Picker",
		element: <ColorPicker />,
		category: "Graphics",
	},
	{
		path: "color-shades-generator",
		name: "Color Shades Generator",
		element: <ColorShadesGenerator />,
		category: "Graphics",
	},
	{
		path: "emoji-picker",
		name: "Emoji Picker",
		element: <EmojiPickerTool />,
		category: "Graphics",
	},
];
