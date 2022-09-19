import React, { useState } from "react";

export const useLoading = (defaultLoading = false) => {
  const [isLoading, setIsLoading] = useState(defaultLoading);

  return { isLoading, setIsLoading };
};
