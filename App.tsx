  import React from "react";
  import axios from 'axios'
  import { Linking } from 'react-native';
  import { useState, useEffect } from 'react';
  import { SafeAreaView, TouchableOpacity, View, Text, FlatList, StyleSheet, Image,RefreshControl } from "react-native";

  interface Article {
    title: string;
    summary: string;
    url: string;
    banner_image: string;
  }

  const App = () => {
    const [newsData, setNewsData] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [refreshing, setRefreshing] = useState(false); // <-- Add this state
    const [page, setPage] = useState(1); 

    const api_url = "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=Y431ITMYNB45WYH9";
  const handleRefresh = () => {
    setRefreshing(true);
    const nextPage = page + 1;

    axios
      .get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=Y431ITMYNB45WYH9&page=${nextPage}`)
      .then((response) => {
        const data = response.data.feed.map((article: Article) => ({
          title: article.title,
          summary: article.summary,
          url : article.url,
          banner_image: article.banner_image,
        }));
        setNewsData((prevData) => [...prevData, ...data]); // Append new data to existing data
        setPage(nextPage); // Update the page state
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

    
    const renderNewsItem = ({ item }: { item: Article }) => {
      const showPlaceholderImage = !item.banner_image || item.banner_image === 'null';
      const handlePress = () => {
        if (item.url) {
          Linking.openURL(item.url).catch((err) => console.error('Error opening URL: ', err));
        }
      };
      return (
        <TouchableOpacity onPress={handlePress}>

          <View style={styles.card}>
            <Text style={styles.heading}>{item.title}</Text>
            <Text style={styles.summaryText}>{item.summary}</Text>
            {showPlaceholderImage ? (
              <Image
                source={require('./placeholder_image.png')} // Replace with your placeholder image
                style={styles.bannerImage}
              />
            ) : (
              <Image source={{ uri: item.banner_image }} style={styles.bannerImage} />
            )}
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={newsData}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.url}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: 'gray',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    heading: {
      color:"black",
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    summaryText: {
      fontSize: 14,
      color: '#555',
      lineHeight: 20,
      marginBottom: 8,
    },
    bannerImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      borderRadius: 8,
    },
  });

  export default App;
