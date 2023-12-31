import axios from 'axios';
import { Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Share, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import Tts from "react-native-tts";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  isDarkMode:boolean
}
interface Props {
  isDarkMode: boolean;
}

const NewsWidget: React.FC<Props> = ({ isDarkMode }: Props) => {
  const [newsData, setNewsData] = useState<Article[]>([]);
  const [isSpeaking,setSpeaking]=useState(false)
  const key = '995e4a922f2a496f9bbf2ffe227a4e33';
  const api_url = 'https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=995e4a922f2a496f9bbf2ffe227a4e33';


  
  useEffect(() => {
   
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(api_url)
      .then((response) => {
        const data = response.data.articles.map((article: Article) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
        }));
        setNewsData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePress = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error('Error opening URL: ', err));
    }
  };

  const renderNewsItem = ({ item }: { item: Article }) => {
    const showPlaceholderImage = !item.urlToImage || item.urlToImage === 'null';
    const widgetData=item.title
    const text=item.title
    const handleShare = async () => {
      try {
        await Share.share({
          title: item.title,
          message: item.title+" "+item.description ,
          url: item.url,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const handleSpeak = () => {
      if (!isSpeaking) {
        // Start speaking
        Tts.speak(text);
        setSpeaking(true);
      } else {
        // Stop speaking
        Tts.stop();
        setSpeaking(false)
      }
    };
    

    return (
      <View style={styles.card}>
        <Text style={styles.heading}>{item.title}</Text>
        <Text style={styles.summaryText}>{item.description}</Text>
        {showPlaceholderImage ? (
          <Image
            source={require('./placeholder_image.png')}
            style={styles.bannerImage}
          />
        ) : (
          <Image source={{ uri: item.urlToImage }} style={styles.bannerImage} />
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => handlePress(item.url)} style={styles.button}>
            <Text style={styles.buttonText}>Read More</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={[styles.button, { backgroundColor: '#27ae60' }]}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSpeak} style={[styles.button, { backgroundColor: 'gray' }]}>
            <Text style={styles.buttonText}>{isSpeaking ? "Stop" : "Speak"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Swiper loop={false} showsPagination={false} horizontal={false} showsVerticalScrollIndicator>
        {newsData.map((item, index) => (
          <View key={index}>{renderNewsItem({ item })}
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'gray',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  shareButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    color: 'black',
    fontFamily: 'oswald',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 18,
    color: '#555',
    lineHeight: 25,
    marginBottom: 8,
  },
  bannerImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  speakButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  speakButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NewsWidget;

