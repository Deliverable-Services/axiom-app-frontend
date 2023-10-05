import Radio, { radioClasses } from "@mui/joy/Radio";
import { CheckCircleOutlineRounded } from "@mui/icons-material";
import {
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalClose,
  Option,
  RadioGroup,
  Select,
  Sheet,
  Typography,
} from "@mui/joy";

import usePriceCalculations from "axiom/hooks/usePriceCalulations";
import useProductVariables from "axiom/hooks/useProductVariables";
import { useEffect, useState } from "react";

const ProductVariations = ({ variations: initialVariations, formula }) => {
  // - Hooks to handle logic for products.
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("")
  const {
    variations,
    selectedVariations,
    onVariantChange,
    onVariantRadioChange,
  } = useProductVariables(initialVariations);
  const { calculatePrice } = usePriceCalculations(formula);
  const [customSize, setCustomSize] = useState({
    height: null,
    width: null,
  });

  useEffect(() => {
    if (selectedVariations["Size"]?.configs) {
      setCustomSize({
        height: selectedVariations["Size"]?.configs?.defaultHeight,
        width: selectedVariations["Size"]?.configs?.defaultWidth,
      });
    }
  }, [selectedVariations]);

  // - Calculate Price for each turnaround.
  const renderCalculatePrice = (variantTitle, variableID) => {
    const choosedVariant = variations.find(
      (item) => item.title === variantTitle
    );

    if (choosedVariant) {
      const choosedItem = choosedVariant?.items.find(
        (item) => item.id == variableID
      );
      return calculatePrice(choosedItem, selectedVariations);
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setCustomSize((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleHeight = (variant) => {
    console.log(selectedVariations[variant?.title].configs.minHeight)
    if(customSize.height < selectedVariations[variant?.title].configs.minHeight){
        setOpen(true)
        setError(selectedVariations[variant?.title].configs.minSizeErrorMessage)
        return
    }
    if(customSize.height > selectedVariations[variant?.title].configs.maxHeight){
        setOpen(true)
        setError(selectedVariations[variant?.title].configs.oversizeErrorMessage)
        return
    }
  }

  const handleWidth = (variant) => {
    if(customSize.width < selectedVariations[variant?.title].configs.minWidth){
        setOpen(true)
        setError(selectedVariations[variant?.title].configs.minSizeErrorMessage)
    }
    if(customSize.width > selectedVariations[variant?.title].configs.maxWidth){
        setOpen(true)
        setError(selectedVariations[variant?.title].configs.oversizeErrorMessage)
    }
  }



  // - Only show the filters once we've done with the variables formatting.
  // - The formatting is done through hooks
  if (variations?.length) {
    return variations.map((variant) => (
      <div key={variant.id}>
        <Grid
          container
          spacing={variant.type === "turnaround" ? 2 : 6}
          sx={{
            // flexGrow: 1,
            marginTop: variant.type === "turnaround" ? 3 : 0,
            flexDirection: variant.type === "turnaround" ? "column" : "row",
          }}
        >
          <Grid item xs={variant.type === "turnaround" ? 12 : 5}>
            {variant.title?.replace(/_/g, " ")}
          </Grid>

          <Grid item xs={variant.type === "turnaround" ? 12 : 7}>
            {(() => {
              // - Render Select box
              // - Select box for all the list type & Quantity List
              if (variant.type === "list" || variant.type === "quantity_list") {
                return (
                  <Select
                    color="primary"
                    disabled={false}
                    placeholder="Choose one…"
                    size="sm"
                    variant="soft"
                    onChange={(_, value) =>
                      onVariantChange(value, variant.title)
                    }
                    value={selectedVariations[variant.title]}
                    startDecorator={
                      <img
                        src={selectedVariations[variant.title]?.image}
                        width={20}
                        height={20}
                      />
                    }
                  >
                    {variant?.items?.length
                      ? variant.items.map((item) => (
                          <Option key={item.id} value={item}>
                            <img src={item.image} height={20} width={20} />
                            <span style={{ marginLeft: 10 }}>{item.title}</span>
                          </Option>
                        ))
                      : null}
                  </Select>
                );
              }

              // - Render Radio Box
              // - For the size or any possible radio buttons
              if (variant.type === "size_new") {
                if (selectedVariations[variant.title]) {
                  return (
                    <>
                      <RadioGroup
                        name={variant.type}
                        value={selectedVariations[variant.title]?.id}
                        onChange={(event) =>
                          onVariantRadioChange(
                            event,
                            variant.title,
                            variant.type
                          )
                        }
                      >
                        {variant?.items?.length
                          ? variant.items.map((item) => {
                              let label = `${item.title} (${item.name})`;

                              if (item.title === "Custom Size") {
                                label = item.title;
                              }

                              return (
                                <Radio
                                  key={`radio-${item.id}`}
                                  value={item.id}
                                  label={label}
                                  color="primary"
                                />
                              );
                            })
                          : null}
                      </RadioGroup>

                      {selectedVariations[variant?.title]?.title ===
                        "Custom Size" && (
                        <div
                          style={{
                            marginTop: 15,
                            display: "flex",
                            justifyContent: "center",
                            gap: "15px",
                          }}
                        >
                          <Input
                            value={customSize.height}
                            placeholder="Min Size"
                            name="height"
                            onBlur={()=>handleHeight(variant)}
                            onChange={handleChange}
                          />
                          <Input
                            value={customSize.width}
                            placeholder="Max Size"
                            name="width"
                            onChange={handleChange}
                            onBlur={()=>handleWidth(variant)}
                          />
                          <Select defaultValue="inch">
                            <Option value="inch">IN</Option>
                          </Select>
                        </div>
                      )}
                    </>
                  );
                }
              }

              // - Render Cards for price & turnaround
              if (variant.type === "turnaround") {
                if (selectedVariations[variant.title]) {
                  return (
                    <RadioGroup
                      value={selectedVariations[variant.title]?.id}
                      overlay
                      name={variant.type}
                      sx={{
                        width: "100%",
                        [`& .${radioClasses.checked}`]: {
                          [`& .${radioClasses.action}`]: {
                            inset: -1,
                            border: "3px solid",
                            borderColor: "primary.500",
                          },
                        },
                        [`& .${radioClasses.radio}`]: {
                          display: "contents",
                          "& > svg": {
                            zIndex: 2,
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            bgcolor: "background.surface",
                            borderRadius: "50%",
                          },
                        },
                      }}
                      onChange={(event) =>
                        onVariantRadioChange(event, variant.title, variant.type)
                      }
                    >
                      <Grid container spacing={8}>
                        {variant?.items?.length
                          ? variant.items.map((item) => {
                              return (
                                <Grid item xs={4} key={item.id}>
                                  <Sheet
                                    variant="outlined"
                                    sx={{
                                      borderRadius: "md",
                                      boxShadow: "sm",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      gap: 1.5,
                                      p: 2,
                                      minWidth: 120,
                                    }}
                                  >
                                    <Radio
                                      value={item.id}
                                      checkedIcon={
                                        <CheckCircleOutlineRounded />
                                      }
                                    />
                                    <FormLabel htmlFor={item.title}>
                                      {item.title}
                                    </FormLabel>
                                    <span>
                                      {(() => {
                                        const price = renderCalculatePrice(
                                          variant.title,
                                          item.id
                                        );

                                        if (price) {
                                          return (
                                            <>
                                              <span>
                                                ${Number(price).toFixed(2)}
                                              </span>
                                              <br />
                                              <span>
                                                $
                                                {(
                                                  price /
                                                  selectedVariations.Quantity
                                                    .value
                                                ).toFixed(3)}{" "}
                                                each
                                              </span>
                                            </>
                                          );
                                        }
                                      })()}
                                    </span>
                                  </Sheet>
                                </Grid>
                              );
                            })
                          : null}
                      </Grid>
                    </RadioGroup>
                  );
                }
              }
            })()}
          </Grid>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            hideBackdrop
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sheet
              variant="outlined"
              sx={{
                maxWidth: 500,
                borderRadius: "md",
                p: 3,
                boxShadow: "none",
              }}
            >
              <ModalClose variant="plain" sx={{ m: 1 }} />
              <Typography id="modal-desc" textColor="text.tertiary">
                {error}
              </Typography>
            </Sheet>
          </Modal>
        </Grid>
      </div>
    ));
  }

  return null;
};

export default ProductVariations;
