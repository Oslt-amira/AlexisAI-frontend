
  
  
  // gets relative date 
  export const getRelativeDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const diffInDays = getDiffInDays(today, date);

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays === 7) {
      return "Last Week";
    } else if (diffInDays <= 30) {
      return "Last Month";
    } else {
      return `${Math.floor(diffInDays / 30)} months ago`;
    }
  };

  export const getDiffInDays = (date1: Date, date2: Date) => {
    const diffInMs = date1.getTime() - date2.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  };


// checks if the prompt sent to Dify is actually a regenerate or show +/- details that we defined 
  export const handleQuery = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const keywords = [
      "regenerate",
      "show more details of",
      "show less details of",
    ];
    return keywords.some((keyword) => lowerCaseQuery.startsWith(keyword));
  };
