import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function explanation() {
    return (
        <View className="flow">
            <View>
                <Text className="type-display text-text-primary text">How it works:</Text>
                <Text className="type-subhead text-text-secondary text">
                    appname is your own personal highlight reel. 
                    Make a post every time you have a win or do something towards reaching a goal, big or small.
                    Watch them pile up! 
                    Every post is evidence that you're becoming the version of yourself you want to be.
                    
                    </Text>
            </View>

            <View className="flow__footer">
                <Link href="/winexampleinput" asChild>
                    <Pressable className="btn-primary">
                        <Text className="btn-primary__label">
                            Make your first post!
                        </Text>
                    </Pressable>
                </Link>
            </View>
        </View>
    );
}
