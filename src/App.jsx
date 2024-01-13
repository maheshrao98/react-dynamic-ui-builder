import { useState } from "react";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import bannerplaceholder from "./assets/images.png";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { HexColorPicker } from "react-colorful";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import image from "./assets/image.png";
import text from "./assets/text.png";
import gap from "./assets/gap.png";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ width: "400px" }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, border: "2px solid transparent", borderRadius: "8px" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const generateHtmlCssCode = (contents) => {
  let htmlCssCode = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Your Website</title>
        <link rel="stylesheet" href="./style.css">
        <link rel="icon" href="./favicon.ico" type="image/x-icon">
      </head>
      <body>
        <main>
  `;

  contents.forEach((content, index) => {
    if (content.type === "image") {
      htmlCssCode += `
        <img
          src="${content.content}"
          alt="Image ${index}"
          style="width: 400px; height: auto;"
        />
      `;
    } else if (content.type === "text") {
      htmlCssCode += `
        <div
          style="color: ${content.fontColor};"
        >
          ${content.content}
        </div>
      `;
    } else if (content.type === "divider") {
      htmlCssCode += "<hr />";
    }
  });

  htmlCssCode += `
        </main>
        <script src="index.js"></script>
      </body>
    </html>
  `;

  console.log(htmlCssCode);
};

// Define a DragItem type
const ItemTypes = {
  COMPONENT: "component",
};

// Define a draggable component

const App = () => {
  const [contents, setContents] = useState([]);
  const [selectedContentIndex, setSelectedContentIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [value, setValue] = useState(0);

  const DraggableComponent = ({ content, index, moveComponent, onSelect }) => {
    const [, drag] = useDrag({
      type: ItemTypes.COMPONENT,
      item: { index },
    });

    const [, drop] = useDrop({
      accept: ItemTypes.COMPONENT,
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveComponent(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });

    const isSelected = selectedContentIndex === index;

    const renderComponent = () => {
      if (content.type === "image") {
        return (
          <img
            src={content.content}
            alt={`Image ${index}`}
            style={{
              width: "400px",
              height: "auto",
              border: isSelected ? "2px solid red" : "none",
            }}
          />
        );
      } else if (content.type === "text") {
        return (
          <div
            style={{
              color: content.fontColor,
              border: isSelected ? "2px solid red" : "none",
            }}
            dangerouslySetInnerHTML={{ __html: content.content }}
          ></div>
        );
      } else if (content.type === "divider") {
        return (
          <hr
            style={{ border: isSelected ? "2px solid red" : "1px solid black" }}
          />
        );
      }

      // Handle other component types if needed
      return null;
    };

    return (
      <div
        ref={(node) => drag(drop(node))}
        onClick={() => onSelect(index)}
        style={{ cursor: "pointer" }}
      >
        {renderComponent()}
      </div>
    );
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addImage = () => {
    setContents((prevContents) => [
      ...prevContents,
      { type: "image", content: bannerplaceholder },
    ]);
  };

  const addText = () => {
    setContents((prevContents) => [
      ...prevContents,
      {
        type: "text",
        fontColor: "black",
        fontSize: 16,
        content: "Hello, World!",
        editable: false,
      },
    ]);
  };

  const addDivider = () => {
    setContents((prevContents) => [...prevContents, { type: "divider" }]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const itemType = event.dataTransfer.getData("text");
    let newContent;

    switch (itemType) {
      case "image":
        newContent = { type: "image", content: bannerplaceholder };
        break;
      case "text":
        newContent = {
          type: "text",
          fontColor: "black",
          fontSize: 16,
          content: "Hello, World!",
          editable: false,
        };
        break;
      case "divider":
        newContent = { type: "divider" };
        break;
      default:
        return;
    }

    setContents((prevContents) => [...prevContents, newContent]);
  };

  const clearLast = () => {
    setContents((prevContents) => [...prevContents.slice(0, -1)]);
  };

  const clearSelected = () => {
    if (selectedContentIndex !== null) {
      setContents((prevContents) =>
        prevContents.filter((_, index) => index !== selectedContentIndex)
      );
      setSelectedContentIndex(null);
    }
  };

  const clearAll = () => {
    setContents([]);
    setSelectedContentIndex(null);
  };

  const handleContentClick = (index) => {
    setSelectedContentIndex(index);
    setEditedText("");
  };

  const handleEditFontText = (value) => {
    setContents((prevContents) => {
      const newContents = [...prevContents];
      newContents[selectedContentIndex].content = value;
      return newContents;
    });
    setEditedText("");
  };

  const handleChangeColor = (newColor) => {
    setContents((prevContents) => {
      const newContents = [...prevContents];
      newContents[selectedContentIndex].fontColor = newColor;
      return newContents;
    });
  };

  const generateCode = () => {
    const htmlCssCode = generateHtmlCssCode(contents);
    console.log(htmlCssCode); // You can replace this with saving or using the generated code as needed
  };

  const moveComponent = (fromIndex, toIndex) => {
    setContents((prevContents) => {
      const newContents = [...prevContents];
      const [removed] = newContents.splice(fromIndex, 1);
      newContents.splice(toIndex, 0, removed);
      return newContents;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{ backgroundColor: "white" }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div
          style={{
            display: "flex",
            padding: "10px",
            height: "400px",
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{
                overflowY: "auto",
                maxHeight: "400px",
                padding: "15px",
                border: "1px solid gray",
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  style={{
                    backgroundColor: "white",
                    position: "relative",
                    width: "400px",
                  }}
                >
                  <Tab label="Content" {...a11yProps(0)} />
                  <Tab label="Design" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignContent: "center",
                  }}
                >
                  <button
                    className="inside-button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text", "image");
                    }}
                  >
                    <img src={image} style={{ width: "80%" }} alt="Image" />
                    <span className="text">Image</span>
                  </button>

                  <button
                    className="inside-button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text", "text");
                    }}
                  >
                    <img src={text} style={{ width: "80%" }} alt="Text" />
                    <span className="text">Text</span>
                  </button>

                  <button
                    className="inside-button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text", "divider");
                    }}
                  >
                    <img src={gap} style={{ width: "80%" }} alt="Divider" />
                    <span className="text">Divider</span>
                  </button>
                  <button className="inside-button" onClick={clearLast}>
                    <span className="icon">🔄</span>
                    <span className="text">Clear Last</span>
                  </button>
                  <button className="inside-button" onClick={clearSelected}>
                    <span className="icon">🗑️</span>
                    <span className="text">Clear Selected</span>
                  </button>
                  <button className="inside-button" onClick={clearAll}>
                    <span className="icon">🧹</span>
                    <span className="text">Clear All</span>
                  </button>
                  <button className="inside-button" onClick={generateCode}>
                    <span className="icon">📋</span>
                    <span className="text">Generate HTML Code</span>
                  </button>
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                {selectedContentIndex !== null && contents.length > 0 ? (
                  contents[selectedContentIndex]?.type === "text" ? (
                    <>
                      <div className="label-input-container">
                        <label className="label-form">Text:</label>
                        <ReactQuill
                          theme="snow"
                          value={contents[selectedContentIndex]?.content}
                          onChange={handleEditFontText}
                        />
                      </div>
                      <div className="label-input-container">
                        <label className="label-form">Font Color:</label>
                        <HexColorPicker
                          color={contents[selectedContentIndex]?.fontColor}
                          onChange={handleChangeColor}
                        />
                      </div>
                    </>
                  ) : (
                    <>Under Construction</>
                  )
                ) : (
                  <>No selected component</>
                )}
              </CustomTabPanel>
            </div>
            <div
              style={{
                marginLeft: "10px",
              }}
            >
              <div
                style={{
                  border: "1px solid gray",
                  width: "428px",
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    backgroundColor: "white",
                    width: "428px",
                    textAlign: "left",
                    color: "black",
                  }}
                >
                  <p
                    style={{
                      textAlign: "left",
                      fontWeight: "600",
                      padding: "3px",
                      margin: 0,
                    }}
                  >
                    Preview
                  </p>
                </div>
              </div>

              <div
                style={{
                  overflowY: "auto",
                  overflowX: "auto",
                  maxHeight: "400px",
                  maxWidth: "428px",
                  border: "1px solid gray",
                  backgroundColor: "#F7F7F7",
                  padding: "10px",
                }}
              >
                {contents.length === 0 ? (
                  <p style={{ color: "black" }}>No content yet added.</p>
                ) : (
                  contents.map((content, index) => (
                    <DraggableComponent
                      key={index}
                      index={index}
                      content={content}
                      moveComponent={moveComponent}
                      onSelect={handleContentClick}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
