// - Price calculation as per the formula provided.
const usePriceCalculations = (formula) => {
    const calculatePrice = (turnaround, selectedVariants) => {
        let localFormula = formula;
        let sizeWidth, sizeHeight;
      
        if (selectedVariants.Size) {
          const temp = selectedVariants.Size.title.split("x").map(str => parseFloat(str.trim()));
          sizeWidth = temp[0];
          sizeHeight = temp[1];
        }
      
        const valuesToBeReplaced = {
          Raised_Spot_UV$base: selectedVariants.Raised_Spot_UV?.base || 0,
          Printed_Sides$base: selectedVariants.Printed_Sides?.base || 0,
          Finishing$base: selectedVariants.Finishing?.base || 0,
          Print_Color$base: selectedVariants.Print_Color?.base || 0,
          Middle_Layer_Color$base: selectedVariants.Middle_Layer_Color?.base || 0,
          Foil_Option$base: selectedVariants.Foil_Option?.base || 0,
          Foil_Color$base: selectedVariants.Foil_Color?.base || 0,
          Turnaround$base: turnaround?.base || 0, 
          Quantity$base: selectedVariants.Quantity?.base || 0,
          Paper_Stock$base: selectedVariants.Paper_Stock?.base || 0,
          Size$base: selectedVariants.Size?.base || 0,
          Die_Shape$base: selectedVariants.Die_Shape?.base || 0,
      
          Quantity: selectedVariants.Quantity?.value || 0,
          Size$w: sizeWidth || 0,
          Size$h: sizeHeight || 0,
          Paper_Stock: selectedVariants.Paper_Stock?.value || 0,
          Finishing: selectedVariants.Finishing?.value || 0,
          Printed_Sides: selectedVariants.Printed_Sides?.value || 0,
          Print_Color: selectedVariants.Print_Color?.value || 0,
          Middle_Layer_Color: selectedVariants.Middle_Layer_Color?.value || 0,
          Foil_Option: selectedVariants.Foil_Option?.value || 0,
          Raised_Spot_UV: selectedVariants.Raised_Spot_UV?.value || 0,
          Foil_Color: selectedVariants.Foil_Color?.value || 0,
          Die_Shape: selectedVariants.Die_Shape?.value || 0,
          Turnaround: turnaround?.value || 0,
        };

        localFormula = localFormula.replace(/floor/g, "Math.floor");
      
        for (const key in valuesToBeReplaced) {
          if (valuesToBeReplaced.hasOwnProperty(key)) {
            const regex = new RegExp(key.replace(/\$/g, "\\$"), "g");
            localFormula = localFormula.replace(regex, valuesToBeReplaced[key]);
          }
        }
      
        const result = eval(localFormula);
        return result.toFixed(2);
    };

    return { calculatePrice }
};

export default usePriceCalculations;