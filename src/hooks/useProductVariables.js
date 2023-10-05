import { useEffect, useState } from "react";

// - All the filterations & other product logics will be rendered here.
const useProductVariables = (initialVariations) => {
  // - State for all the variables with formatted data.
  const [variations, setVariations] = useState(initialVariations);
  // - State for storing all the selected values
  const [selectedVariations, setSelectedVariations] = useState({});

  console.log(variations, "::");

  // - Only Once to setup Default Filters.
  useEffect(() => {
    initialVariations
      .sort((a, b) => Number(a.order) - Number(b.order))
      .filter((item) => item.hidden == 0)
      .filter((item) => !item.filters.length)
      .map((item) => {
        const hasDefaultValue = item.items.findIndex(
          (item) => item.default == 1
        );
        if (item.title === "Size") {
          setSelectedVariations((prevValue) => ({
            ...prevValue,
            [item.title]: hasDefaultValue
              ? { configs: item.configs, ...item.items[hasDefaultValue] }
              : { configs: item.configs, ...item.items[0] },
          }));
          return;
        }
        setSelectedVariations((prevValue) => ({
          ...prevValue,
          [item.title]: hasDefaultValue
            ? item.items[hasDefaultValue]
            : item.items[0],
        }));
      });
  }, [initialVariations]);

  // - Logic to handle the formatting for our variables & there items.
  // - #TODO - This code can be improved alot for adding performance.
  // - Current Analysis - 1.6 sec as per performance gatherer.
  useEffect(() => {
    const formattedData = initialVariations
      .sort((a, b) => Number(a.order) - Number(b.order))
      .filter((item) => item.hidden == 0)
      .filter((item) => {
        if (item.filters?.length === 0) {
          return true;
        }

        const { relatedTo, relatedItems } = item.filters[0];
        // - #TODO: For now, I am only picking the first filter
        // - We've to think about the case in which multiple product filters can be present.
        if (
          selectedVariations &&
          selectedVariations[relatedTo.title] &&
          Object.keys(selectedVariations[relatedTo.title])
        ) {
          if (
            relatedItems.findIndex(
              (item) => item.id == selectedVariations[relatedTo.title]?.id
            ) != -1
          ) {
            return true;
          }
        } else {
          // - If the key is not present in selectedVariants then hide the  value.
          // - Or if the key is present in selectedVariants but is not selected
          return false;
        }
      })
      .map((item) => {
        if (item.items?.length) {
          return {
            ...item,
            items: item.items
              .sort((a, b) => Number(a.order) - Number(b.order))
              .filter((item) => item.isHidden == 0)
              .filter((option) => {
                if (option.filters?.length === 0) {
                  return true;
                }

                const { relatedTo, relatedItems } = option.filters[0]; // - #TODO: For now, I am only picking the first filter
                if (
                  selectedVariations &&
                  selectedVariations[relatedTo.title] &&
                  Object.keys(selectedVariations[relatedTo.title])
                ) {
                  if (
                    relatedItems.findIndex(
                      (relatedItem) =>
                        relatedItem.id == selectedVariations[relatedTo.title].id
                    ) != -1
                  ) {
                    return true;
                  }
                } else {
                  // - If the key is not present in selectedVariants then hide the value.
                  // - Or if the key is present in selectedVariants but is not selected
                  return false;
                }
              }),
          };
        }

        return item;
      });
    setVariations(formattedData);
  }, [selectedVariations]);

  // - On each Variant change through list
  const onVariantChange = (value, variantTitle) => {
    setSelectedVariations((prevValue) => ({
      ...prevValue,
      [variantTitle]: value,
    }));
  };

  // - On each variant change through radio buttons
  const onVariantRadioChange = (evt, variantTitle, variantType) => {
    const { value } = evt.target;
    const choosedVariant = variations.find((item) => item.type === variantType);

    if (choosedVariant) {
      const choosedItem = choosedVariant?.items.find(
        (item) => item.id == value
      );
      if (choosedItem) {
        if (variantTitle === "Size") {
          setSelectedVariations((prevValue) => ({
            ...prevValue,
            [variantTitle]: {
              ...choosedItem,
              configs: prevValue[variantTitle].configs,
            },
          }));
          return;
        }
        setSelectedVariations((prevValue) => ({
          ...prevValue,
          [variantTitle]: choosedItem,
        }));
      }
    }
  };

  return {
    variations,
    selectedVariations,
    onVariantChange,
    onVariantRadioChange,
  };
};

export default useProductVariables;
