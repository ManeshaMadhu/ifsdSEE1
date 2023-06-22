import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import Movie from "scenes/widgets/movie";

const MoviePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <Movie/>
        </Box>
      </Box>
    </Box>
  );
};

export default MoviePage;
