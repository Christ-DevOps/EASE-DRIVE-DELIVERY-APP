import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';

const SignupType = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join as</Text>
      
      <Pressable 
        style={styles.card}
        onPress={() => router.push('/(deliveryAgent)/auth/Signup')}
      >
        <Text style={styles.cardTitle}>Delivery Agent</Text>
        <Text style={styles.cardText}>Earn money by delivering orders</Text>
      </Pressable>

      <Pressable 
        style={styles.card}
        onPress={() => router.push('/(partners)/auth/Signup')}
      >
        <Text style={styles.cardTitle}>Business Partner</Text>
        <Text style={styles.cardText}>Grow your business with our platform</Text>
      </Pressable>

      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Link href="/(auth)/LoginScreen" style={styles.loginLink}>
          Log in
        </Link>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1F33',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF7622',
    marginBottom: 5,
  },
  cardText: {
    color: '#666',
    fontSize: 14,
  },
  loginText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  loginLink: {
    color: '#FF7622',
    fontWeight: 'bold',
  },
});

export default SignupType;