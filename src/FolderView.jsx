import { Icon } from "./Icon";
import { useImmer } from "use-immer";

function FolderView({ files, folders, name, setHistory }) {
  if (!folders) folders = [];
  if (!files) files = [];
  // const [content, setContent] = useImmer(null);
  let content;
  const foldersIcons = folders.map((folder) => (
    <div
      key={folder.name}
      className="folderview"
      onDoubleClick={() => {
        setHistory((history) => [
          ...history,
          { name: folder.name, folders: folder.folders, files: folder.files },
        ]);
      }}
    >
      <Icon img="assets/icons/folder.svg" />
      <div className="name">{folder.name}</div>
    </div>
  ));
  const filesIcons = files.map((file) => (
    <div className="folderview" key={file.name}>
      <Icon img="assets/icons/file.svg" />
      <div className="name">{file.name}</div>
    </div>
  ));
  if (foldersIcons.length || filesIcons.length) {
    content = (
      <div className="content">
        {foldersIcons}
        {filesIcons}
      </div>
    );
  } else {
    content = (
      <div className="content">
        <div style={{ height: "100%", width: "100%", textAlign: "center" }}>
          Folder is empty
        </div>
      </div>
    );
  }
  // console.log(foldersIcons);
  return <>{content}</>;
}
export default FolderView;
