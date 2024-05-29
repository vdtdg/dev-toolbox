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
import LinkedinTimestampParser from "./tools/linkedin-timestamp-parser/linkedin-timestamp-parser";
import FileDiff from "./tools/file-diff/file-diff";
import BinaryHelper from "./tools/binary-helper/binary-helper";
import ImageHelper from "./tools/image-helper/image-helper";
import HttpRequest from "./tools/http-request/http-request";
import JwtHelper from "./tools/jwt-helper/jwt-helper";
import ColorPicker from "./tools/color-picker/color-picker";
import ColorShadesGenerator from "./tools/color-shades-generator/color-shades-generator";
import EmojiPickerTool from "./tools/emoji-picker/emoji-picker";
import LoremIpsumGenerator from "./tools/lorem-ipsum-generator/lorem-ipsum-generator";
import SeoWrapper from "./seo";

export const toolList = [
  {
    path: "pomodoro",
    name: "Pomodoro",
    element: (
      <SeoWrapper name="Pomodoro" path="pomodoro">
        <Pomodoro />
      </SeoWrapper>
    ),
    category: "Productivity",
  },
  {
    path: "crontab",
    name: "Cron Tab Helper",
    element: (
      <SeoWrapper name="Cron Tab Helper" path="crontab">
        <CronTab />
      </SeoWrapper>
    ),
    category: "Productivity",
  },
  {
    path: "levenshtein-distance",
    name: "Levenshtein Distance Calculator",
    element: (
      <SeoWrapper
        name="Levenshtein Distance Calculator"
        path="levenshtein-distance"
      >
        <LevenshteinCalculator />
      </SeoWrapper>
    ),
    category: "Cryptography",
  },
  {
    path: "uri-encoder-decoder",
    name: "Uri Encoder - Decoder",
    element: (
      <SeoWrapper name="Uri Encoder - Decoder" path="uri-encoder-decoder">
        <UriEncoderDecoder />
      </SeoWrapper>
    ),
    category: "Cryptography",
  },
  {
    path: "html-encoder-decoder",
    name: "HTML Encoder - Decoder",
    element: (
      <SeoWrapper name="HTML Encoder - Decoder" path="html-encoder-decoder">
        <HtmlEncoderDecoder />
      </SeoWrapper>
    ),
    category: "Cryptography",
  },
  {
    path: "base64-encoder-decoder",
    name: "Base64 Encoder - Decoder",
    element: (
      <SeoWrapper name="Base64 Encoder - Decoder" path="base64-encoder-decoder">
        <Base64EncoderDecoder />
      </SeoWrapper>
    ),
    category: "Cryptography",
  },
  {
    path: "md5-hasher",
    name: "MD5 Hasher",
    element: (
      <SeoWrapper name="MD5 Hasher" path="md5-hasher">
        <MD5Hasher />
      </SeoWrapper>
    ),
    category: "Cryptography",
  },
  {
    path: "sha1-hasher",
    name: "SHA1 Hasher",
    element: (
      <SeoWrapper name="SHA1 Hasher" path="sha1-hasher">
        <SHA1Hasher />
      </SeoWrapper>
    ),
    category: "Cryptography",
  },
  {
    path: "sha256-hasher",
    name: "SHA256 Hasher",
    element: (
      <SeoWrapper name="SHA256 Hasher" path="sha256-hasher">
        <SHA256Hasher />
      </SeoWrapper>
    ),
    category: "Cryptography",
  },
  {
    path: "sha512-hasher",
    name: "SHA512 Hasher",
    element: (
      <SeoWrapper name="SHA512 Hasher" path="sha512-hasher">
        <SHA512Hasher />
      </SeoWrapper>
    ),
    category: "Cryptography",
  },
  {
    path: "ripemd-160-hasher",
    name: "RIPEMD-160 Hasher",
    element: (
      <SeoWrapper name="RIPEMD-160 Hasher" path="ripemd-160-hasher">
        <RIPEMD160Hasher />
      </SeoWrapper>
    ),
    category: "Cryptography",
  },
  {
    path: "timestamp-to-time",
    name: "Timestamp to time",
    element: (
      <SeoWrapper name="Timestamp to time" path="timestamp-to-time">
        <TimestampToTime />
      </SeoWrapper>
    ),
    category: "Time",
  },
  {
    path: "linkedin-post-date-parser",
    name: "LinkedIn Post Date Parser",
    element: (
      <SeoWrapper
        name="LinkedIn Post Date Parser"
        path="linkedin-post-date-parser"
      >
        <LinkedinTimestampParser />
      </SeoWrapper>
    ),
    category: "Time",
  },
  {
    path: "change-base-helper",
    name: "Change Base Helper",
    element: (
      <SeoWrapper name="Change Base Helper" path="change-base-helper">
        <ChangeBaseHelper />
      </SeoWrapper>
    ),
    category: "Number",
  },
  {
    path: "ascii-reference-table",
    name: "ASCII Reference Table",
    element: (
      <SeoWrapper name="ASCII Reference Table" path="ascii-reference-table">
        <AsciiReferenceTable />
      </SeoWrapper>
    ),
    category: "Misc",
  },
  {
    path: "help-me-stuck-in-vim",
    name: "Help me I'm stuck in Vim!",
    element: (
      <SeoWrapper name="Help me I'm stuck in Vim!" path="help-me-stuck-in-vim">
        <HelpMeStuckInVim />
      </SeoWrapper>
    ),
    category: "Misc",
  },
  {
    path: "network-ipv4-helper",
    name: "IPv4 Helper",
    element: (
      <SeoWrapper name="IPv4 Helper" path="network-ipv4-helper">
        <Ipv4Helper />
      </SeoWrapper>
    ),
    category: "Number",
  },
  {
    path: "binary-helper",
    name: "Binary Helper",
    element: (
      <SeoWrapper name="Binary Helper" path="binary-helper">
        <BinaryHelper />
      </SeoWrapper>
    ),
    category: "Number",
  },
  {
    path: "image-helper",
    name: "Image Helper",
    element: (
      <SeoWrapper name="Image Helper" path="image-helper">
        <ImageHelper />
      </SeoWrapper>
    ),
    category: "Graphics",
  },
  {
    path: "file-diff",
    name: "File Diff",
    element: (
      <SeoWrapper name="File Diff" path="file-diff">
        <FileDiff />
      </SeoWrapper>
    ),
    category: "Misc",
  },
  {
    path: "http-request",
    name: "HTTP Request",
    element: (
      <SeoWrapper name="HTTP Request" path="http-request">
        <HttpRequest />
      </SeoWrapper>
    ),
    category: "Network",
  },
  {
    path: "jwt-helper",
    name: "JWT Helper",
    element: (
      <SeoWrapper name="JWT Helper" path="jwt-helper">
        <JwtHelper />
      </SeoWrapper>
    ),
    category: "Cryptography",
  },
  {
    path: "color-picker",
    name: "Color Picker",
    element: (
      <SeoWrapper name="Color Picker" path="color-picker">
        <ColorPicker />
      </SeoWrapper>
    ),
    category: "Graphics",
  },
  {
    path: "color-shades-generator",
    name: "Color Shades Generator",
    element: (
      <SeoWrapper name="Color Shades Generator" path="color-shades-generator">
        <ColorShadesGenerator />
      </SeoWrapper>
    ),
    category: "Graphics",
  },
  {
    path: "emoji-picker",
    name: "Emoji Picker",
    element: (
      <SeoWrapper name="Emoji Picker" path="emoji-picker">
        <EmojiPickerTool />
      </SeoWrapper>
    ),
    category: "Graphics",
  },
  {
    path: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    element: (
      <SeoWrapper name="Lorem Ipsum Generator" path="lorem-ipsum-generator">
        <LoremIpsumGenerator />
      </SeoWrapper>
    ),
    category: "Misc",
  },
];
