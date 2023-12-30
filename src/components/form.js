import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import * as Yup from "yup";
import { db } from "../firebase";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  sector: Yup.string().required("Sector is required"),
  agreeToTerms: Yup.boolean().oneOf([true], "You must agree to the terms"),
});

const MainForm = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isEditView = pathname.includes("edit");

  const [dataCollection, setDataCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Rendering!!");
  const formik = useFormik({
    initialValues: {
      name: "",
      agreeToTerms: false,
      selectedSector: "",
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      try {
        await Yup.object({
          sector: Yup.string().required("Sector is required"),
        }).validate({ sector: values.sector }, { abortEarly: false });

        const dataToUpdate = {
          data: {
            name: values.name,
            selectedSector: values.sector,
            agreeToTerms: values.agreeToTerms,
            sectors: dataCollection?.[0].data.sectors,
          },
        };

        // Assuming your document ID is stored in dataCollection[0].id
        const docRef = doc(db, "testCollection", dataCollection[0].id);

        // Update only the specified fields
        await updateDoc(docRef, dataToUpdate);
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Error saving data:", error.message);
      }
    },
  });

  // Not working with MUI
  // const menuOptions = useMemo(() => {
  //   return dataCollection?.[0]?.data?.sectors?.map(({ label, options }) => (
  //     <MenuList key={label}>
  //       <ListSubheader>{label}</ListSubheader>
  //       {Object.entries(options)?.map(([key, value]) => (
  //         <MenuItem key={value} value={value}>
  //           {key}
  //         </MenuItem>
  //       ))}
  //     </MenuList>
  //   ));
  // }, [dataCollection]);

  const selectOptions = useMemo(
    () =>
      dataCollection?.[0]?.data?.sectors?.map(({ label, options }) => ({
        label: label,
        options: Object.entries(options)?.map(([key, value]) => ({
          label: key,
          value: value,
        })),
      })),
    [dataCollection],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "testCollection"));
        const querySnapshot = await getDocs(q);

        // Extract data from documents
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDataCollection(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Update formik values only if data is loaded
      formik.setValues({
        name: dataCollection?.[0]?.data?.name || "",
        agreeToTerms: dataCollection?.[0]?.data?.agreeToTerms || false,
        sector: dataCollection?.[0]?.data?.selectedSector || "",
      });
    }
  }, [loading, dataCollection]);

  if (loading) {
    return (
      <Grid item container alignItems="center" justifyContent="center" pt={16}>
        Loading...
      </Grid>
    );
  }

  return (
    <Grid
      sx={{ backgroundColor: "grey", height: "100%" }}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Box sx={{ backgroundColor: "#fff", p: 2, borderRadius: 2 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack rowGap={2} columnGap={2} margin="auto">
            <Typography variant="body1">
              Please enter your name and pick the Sector you are currently
              involved in.
            </Typography>

            <Grid item>
              <InputLabel>Name</InputLabel>
              <TextField
                fullWidth
                id="name"
                disabled={!isEditView}
                name="name"
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="single-select">Sector</InputLabel>
              <Select
                isDisabled={!isEditView}
                options={selectOptions}
                value={selectOptions?.find(group =>
                  group?.options?.some(
                    opt => opt?.value === formik?.values?.sector,
                  ),
                )}
                onChange={selectedOption =>
                  formik.setFieldValue("sector", selectedOption?.value)
                }
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    padding: "12px 0",
                    boxShadow: state.isFocused ? "none" : null,
                  }),
                }}
                isClearable
                isSearchable
              />
              {formik.errors.sector && (
                <Typography color="error" fontSize="0.75rem" pl={1.5}>
                  {formik.errors.sector}
                </Typography>
              )}
            </Grid>

            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={!isEditView}
                    name="agreeToTerms"
                    checked={formik.values.agreeToTerms}
                    onChange={formik.handleChange}
                  />
                }
                label="Agree to terms"
              />
              {formik.touched.agreeToTerms &&
                Boolean(formik.errors.agreeToTerms) && (
                  <Typography color="error">
                    {formik.errors.agreeToTerms}
                  </Typography>
                )}
            </Grid>

            <Grid>
              {isEditView && (
                <Button type="submit" variant="contained">
                  Save
                </Button>
              )}
            </Grid>
          </Stack>
        </form>
        {!isEditView && (
          <Button
            variant="contained"
            type="button"
            onClick={() => {
              navigate("/edit");
            }}
          >
            Edit
          </Button>
        )}
      </Box>
    </Grid>
  );
};

export default MainForm;
