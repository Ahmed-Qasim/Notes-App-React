import ReactMde from "react-mde";
import { useState } from "react";
import Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
});

function Editor(prop) {
    const [selectedTab, setSelectedTab] = useState("write");
    return (
        <section className="pane editor">
            <ReactMde
                value={prop.tempNote}
                onChange={prop.setTempNote}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                    Promise.resolve(converter.makeHtml(markdown))
                }
                minEditorHeight={100}
                heightUnits="vh"
            ></ReactMde>
        </section>
    );
}

export default Editor;
