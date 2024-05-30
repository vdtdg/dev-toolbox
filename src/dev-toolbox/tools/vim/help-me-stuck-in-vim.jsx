import "../tools-common.css";

export default function HelpMeStuckInVim() {
  return (
    <>
      <h1 className="tool-title">Help me I'm stuck in VIM !</h1>
      <p>
        Don't panic.
        <br />
        <br />
        Just press <span className="keyboard-stroke">Escape</span> a couple of
        times, and then:
        <ul>
          <li>
            if you want to save: type{" "}
            <span className="keyboard-stroke">:w</span> (and then press enter)
          </li>
          <li>
            type <span className="keyboard-stroke">:q!</span> to quit
          </li>
        </ul>
        <br />
        And if you want a good tutorial, type{" "}
        <span className="keyboard-stroke">vimtutor</span> in your terminal.
      </p>
    </>
  );
}
