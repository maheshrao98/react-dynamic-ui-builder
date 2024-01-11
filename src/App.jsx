import { useState } from "react";
import React from "react";
import "./App.css";
import bannerplaceholder from "./assets/images.png";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { HexColorPicker } from "react-colorful";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
        <Box sx={{ p: 0 }}>
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

const App = () => {
  const [contents, setContents] = useState([]);
  const [selectedContentIndex, setSelectedContentIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [value, setValue] = useState(0);

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

  const handleChangeFontSize = (fontSize) => {
    setContents((prevContents) => {
      const newContents = [...prevContents];
      newContents[selectedContentIndex].fontSize = fontSize;
      return newContents;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ overflowY: "auto", maxHeight: "400px" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              style={{ backgroundColor: "whitesmoke", position:"relative", width:"400px" }}
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
              <button className="inside-button" onClick={addImage}>
                <span className="icon">🖼️</span>
                <span className="text">Add Image</span>
              </button>
              <button className="inside-button" onClick={addText}>
                <span className="icon">📝</span>
                <span className="text">Add Text</span>
              </button>
              <button className="inside-button" onClick={addDivider}>
                <span className="icon">〰</span>
                <span className="text">Add Divider</span>
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
              backgroundColor: "lightgray",
              width: "428px",
              zIndex: 10,
            }}
          >
            <div
              style={{
                position: "relative",
                backgroundColor: "white",
                minHeight: "48px",
                width: "428px",
                textAlign: "center",
                color: "black",
              }}
            >
              <p className="centered-element">PREVIEW</p>
            </div>
          </div>

          <div
            style={{
              overflowY: "auto",
              overflowX: "auto",
              maxHeight: "400px",
              maxWidth: "428px",
              border: "1px solid black",
              backgroundColor: "lightgray",
            }}
          >
            {contents.length === 0 ? (
              <p style={{ color: "black" }}>No content yet added.</p>
            ) : (
              contents.map((content, index) => (
                <div
                  key={index}
                  onClick={() => handleContentClick(index)}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    marginBottom: "5px",
                    padding: "5px",
                    border:
                      selectedContentIndex === index ? "2px solid red" : "none",
                  }}
                >
                  {content.type === "image" && (
                    <img
                      src={content.content}
                      alt={`Image ${index}`}
                      style={{ width: "400px", height: "auto" }}
                    />
                  )}
                  {content.type === "text" && (
                    <div
                      style={{
                        color: content.fontColor,
                      }}
                      dangerouslySetInnerHTML={{ __html: content.content }}
                    >
                    </div>
                  )}
                  {content.type === "divider" && <hr />}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
