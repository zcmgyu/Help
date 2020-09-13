import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SRLWrapper } from "simple-react-lightbox";
import SimpleReactLightbox from "simple-react-lightbox";

const App = () => {
  const options = {
    settings: {
      disablePanzoom: true,
    },
    buttons: {
      backgroundColor: "#1b5245",
      iconColor: "rgba(126, 172, 139, 0.8)",
      showAutoplayButton: false,
      showThumbnailsButton: false,
      showDownloadButton: false,
      showFullscreenButton: false,
      showNextButton: false,
      showPrevButton: false,
    },
    thumbnails: {
      showThumbnails: false,
    },
  };

  const [search, setSearch] = useState({
    query: "",
  });

  const [list, setList] = useState([]);

  const [loading, setLoading] = useState(false);
  const typer = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
    GetImages(e.target.value);
  };

  const GetImages = async (image) => {
    try {
      setLoading(false);
      const data = await fetch(
        "https://pixabay.com/api/?key=18269871-9984b5717c4bef14378a76910&q=" +
          image +
          "&image_type=photo&pretty=true"
      );
      const json = await data.json();
      setList(json);
      setLoading(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const results = list.filter((img) => {
      return img.toLowerCase().includes(search.query.toLowerCase());
    });
    setList(results);
  }, []);

  return (
    <>
      <Container>
        <h1>PixaBay Finder</h1>
        <Row>
          <Col>
            <Input
              id="query"
              name="query"
              value={search.query}
              onChange={typer}
            />
          </Col>
        </Row>

        <Row>
          {search.query ? (
            list.totalHits > 0 ? (
              loading ? (
                list.hits.map((item, i) => (
                  <SimpleReactLightbox key={i}>
                    <ImageCol>
                      <SRLWrapper options={options}>
                        <a href={item.largeImageURL} data-attribute="SRL">
                          <img src={item.webformatURL} alt="" />
                        </a>
                      </SRLWrapper>
                    </ImageCol>
                  </SimpleReactLightbox>
                ))
              ) : (
                "No data..."
              )
            ) : (
              <div className="spinner"></div>
            )
          ) : (
            ""
          )}
        </Row>
      </Container>
    </>
  );
};

export default App;

const Container = styled.div`
  margin: 10px;
  text-align: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  @media (max-width: 1600px) {
    flex-direction: column;
  }
`;

const Col = styled.div`
  width: 100%;
`;

const ImageCol = styled.div`
  width: 20%;
  padding: 10px;
  img {
    width: 100%;
    height: 500px;
  }
  @media (max-width: 1600px) {
    width: 100%;
  }
`;

const Input = styled.input`
  display: block;
  width: 100%;
  min-height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid gray;
  appearance: none;
  border-radius: 0.25rem;
  margin-bottom: 10px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:focus {
    border-color: #0275d8;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px lightblue;
    outline: 0 none;
  }
`;
