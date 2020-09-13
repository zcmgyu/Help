import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { SRLWrapper } from "simple-react-lightbox";
import SimpleReactLightbox from "simple-react-lightbox";
import { debounce } from "lodash";

const App = () => {
  const isMountedRef = useRef(false);
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

  const [query, setQuery] = useState('');

  const [list, setList] = useState([]);

  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(debounce((q) => {
    setQuery(q);
  }, 500), []);

  const handleSearch = (e) => {
    debouncedSearch(e.target.value)
  };


  useEffect(() => {
    isMountedRef.current = true;

    const getImages = async (q) => {
      try {
        if (isMountedRef.current) {
          setLoading(true);
        }

        const data = await fetch(
          "https://pixabay.com/api/?key=18291078-e6aec1ebf091385151e7ff5e7&q=" +
          q +
          "&image_type=photo&pretty=true"
        );
        const json = await data.json();
        if (isMountedRef.current) {
          setList(json);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }

    getImages(query);

    return () => {
      isMountedRef.current = false;
    }
  }, [query]);

  return (
    <>
      <Container>
        <h1>PixaBay Finder</h1>
        <Row>
          <Col>
            <Input
              id="query"
              name="query"
              onChange={handleSearch}
            />
          </Col>
        </Row>
        {loading && <div className="spinner"></div>}
        <Row>
          {
            query && !loading && list.hits.length > 0 ? list.hits.map((item) => (
              <SimpleReactLightbox key={item.id}>
                <ImageCol>
                  {/* <SRLWrapper options={options}> */}
                  <a href={item.largeImageURL} data-attribute="SRL">
                    <img src={item.webformatURL} alt="" />
                  </a>
                  {/* </SRLWrapper> */}
                </ImageCol>
              </SimpleReactLightbox>
            )) : <p>No data...</p>
          }
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
